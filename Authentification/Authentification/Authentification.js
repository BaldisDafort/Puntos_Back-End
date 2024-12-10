const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// URL de connexion MongoDB
const url = "mongodb://admin:adminMONGO@localhost:27015/mydatabase?authSource=admin";
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
app.get('/users', async (req, res) => {
    try {
        const users = await dbo.collection("users").find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Ajouter un utilisateur
app.post('/users/add', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: "L'e-mail, le nom d'utilisateur et le mot de passe sont requis" });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
});

// Vérifier un utilisateur
app.post('/users/verify', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await dbo.collection("users").findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).json({ message: "Utilisateur vérifié avec succès", user });
        } else {
            res.status(401).json({ message: "Mot de passe incorrect" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la vérification de l'utilisateur" });
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`L'application écoute sur le port ${port}`);
});
