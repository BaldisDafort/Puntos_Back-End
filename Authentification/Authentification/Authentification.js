const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/DB1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());

// Exemple d'API REST
app.get('/api/data', (req, res) => {
  // Récupérer des données depuis MongoDB
  res.json({ message: "Données envoyées depuis le backend" });
});

app.listen(port, () => {
  console.log(`Backend serveur en cours d'exécution sur le port ${port}`);
});
