const express = require("express");
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://jb:sulfate4@cluster0.qzefequ.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res) => {
    res.json({ message: "ok !"});
});

module.exports = app;