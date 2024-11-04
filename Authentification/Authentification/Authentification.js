const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
const bcrypt = require('bcrypt');
// Use the cors middleware to enable CORS for all routes
app.use(cors());
 
app.use(express.json());
let MongoClient = require('mongodb').MongoClient;
let mongodb = require('mongodb');
let url = "mongodb://localhost:27017/DB1";


let dbo;
const connectToMongo = async () => {
try {
console.log("Trying to connect to MongoDB");
const client = await MongoClient.connect(url);
console.log("Connected to MongoDB");
dbo = client.db("DB1");
} catch (err) {
console.error("Error connecting to MongoDB:", err);
process.exit(1);
}
};

// Call the async function when the server starts
connectToMongo();

app.get('/users', async (req, res) => {
    try {
    const usersResult = await
    dbo.collection("users").find({}).toArray();
    console.log(usersResult);
    res.status(200).json(usersResult);
    } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.stack })
    }
    });
    

// Endpoint pour récupérer les utilisateurs
app.get('/users', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("DB1");
        dbo.collection("users").find({}).toArray((err, users) => {
            if (err) {
                res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
            } else {
                res.status(200).json(users);
            }
            db.close();
        });
    });
});

// Endpoint pour ajouter un nouvel utilisateur
app.post('/users/add', async (req, res) => {
    const {email, username, password} = req.body;
    try {

        //Test pour vérifier si les champs sont remplis
        if (!email || !username || !password){
            return res.status(404).json({error : 'L\'e-mail, le nom d\'utilisateur et le mot de passe sont requis'});
        }

        //Indique le nombre de couche de hachage
        const saltRounds = 10;

        //Créer une constante en hachant le mot de passe récupéré
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = {
            email,
            username,
            password : hashedPassword,
            Parties_jouées : 0,
            Parties_gagnées : 0
        }
        const result = await dbo.collection("users").insertOne(newUser);
        console.log("result", result);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès, id= ' + result.insertedId });
    } catch (e) {
        console.log("error", e);  
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
});

// Endpoint pour vérifier un utilisateur existant
app.post('/users/verify', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await dbo.collection("users").findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Comparer le mot de passe fourni avec le mot de passe haché dans la BDD
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).json({ message: 'Utilisateur vérifié avec succès', user });
        } else {
            res.status(401).json({ message: 'Mot de passe incorrect' });
        }

    } catch (e) {
        console.error("Erreur lors de la vérification de l'utilisateur:", e);
        res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur' });
    }
});

app.listen(port, () => {
    console.log(`L'application écoute sur le port ${port}`);
});