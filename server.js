const express = require('express');
require('dotenv').config();
const app = express();
const port = parseInt(process.env.PORT, 10);
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { isPasswordValid } = require('./authentification/password-validity');
const { hashPassword, comparePassword } = require('./authentification/bcrypt-utility');
const { generateToken } = require('./authentification/json_web_token-utility');
const errorHandler = require('./error/error-handler');

// Middleware
app.use(cors());
app.use(express.json());

// URL de connexion MongoDB
const url = "mongodb://localhost:27017";
let dbo;

// Connexion à MongoDB
const connectToMongo = async () => {
    try {
        console.log("Trying to connect to MongoDB...");
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
        dbo = client.db("DB1");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Arrêter le processus si la connexion échoue
    }
};

// Appeler la fonction de connexion au démarrage
connectToMongo();

// Routes
// Récupérer tous les utilisateurs
app.get('/users', async (req, res, next) => {
    try {
        const users = await dbo.collection("users").find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        const error = new Error("Erreur lors de la récupération des utilisateurs");
        error.statusCode = 404; // Code HTTP spécifique
        error.details = err.message || 'Erreur interne du serveur'; // Message d'origine

        next(error); // Envoyer l'erreur au middleware de gestion
    }
});

// Ajouter un utilisateur
app.post('/users/add', async (req, res, next) => {
    const { email, username, password } = req.body;

    // Validation des données
    if (!email || !username || !password) {

        const error = new Error("L'email, l'username ou le password sont absents");
        error.statusCode = 401 // Code HTTP spécifique
        error.details = 'Données manquantes.'; // Message d'origine

        next(error); // Envoyer l'erreur au middleware de gestion    
    }
    // Check la validité de la longueur du mot de passe
    if(!isPasswordValid(password)) {
        
        const error = new Error("Le mot de passe n'est pas assez sécurisé");
        error.statusCode = 404; // Code HTTP spécifique
        error.details ='Votre mot de passe doit avoir plus de 8 caractères'; // Message d'origine

        next(error); // Envoyer l'erreur au middleware de gestion
    }

    try {
        const hashedPassword = hashPassword(password);

        const newUser = {
            email,
            username,
            password: hashedPassword,
            Parties_jouées: 0,
            Parties_gagnées: 0,
        };

        const result = await dbo.collection("users").insertOne(newUser);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: result.insertedId });
    } catch (err) {
        const error = new Error("Erreur lors de la récupération des utilisateurs");
        error.statusCode = 500; // Code HTTP spécifique
        error.details = err.message || 'Erreur interne du serveur'; // Message d'origine

        next(error); // Envoyer l'erreur au middleware de gestion
    }
});

// Authentifier un utilisateur
app.post('/users/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await dbo.collection("users").findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (await comparePassword(password, user.password)) {
            const userToken = generateToken(user);
            res.status(200).json({ message: "Utilisateur vérifié avec succès", token: userToken, user: user });
        } else {
            const error = new Error("Le mot de passe n'est pas valide");
            error.statusCode = 401; // Code HTTP spécifique
            error.details = err.message || 'Erreur interne du serveur'; // Message d'origine
    
            next(error); // Envoyer l'erreur au middleware de gestion
        }
    } catch (err) {
        const error = new Error("Erreur interne du serveur");
        error.statusCode = 500; // Code HTTP spécifique
        error.details = err.message || 'Erreur interne du serveur'; // Message d'origine

        next(error); // Envoyer l'erreur au middleware de gestion
    }
});

const authMiddleware = require('./authMiddleware');

// Route protégée par authentification
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: "Vous avez accès à cette route protégée.", user: req.user });
});


//Prise en charge des erreurs (mettre à la fin du fichier pour récupérer toutes les erreurs)
app.use(errorHandler);

// Lancer le serveur
app.listen(port, () => {
    console.log(`L'application écoute sur le port ${port}`);
});
