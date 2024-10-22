const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors')
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
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log(newUser)
    try {
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
    const checkUser = req.body;
    console.log(checkUser)
    try {
        const result = await dbo.collection("users").findOne(checkUser);
        if(result){
            res.status(201).json({ message: 'Utilisateur vérifié avec succès', result});
        }
        else{
            return res.status(404).json({ message: 'Utilisateur non trouvé ou mot de passe incorrect' });
        }
        
        
    } catch (e) {
        console.log("error", e);  
        res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur' });
    }
});

app.listen(port, () => {
    console.log(`L'application écoute sur le port ${port}`);
});