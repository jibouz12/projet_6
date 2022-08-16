const Sauce = require("../models/Sauce");


////////////////////////
// récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

////////////////////////////
// récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

///////////////////////////
// créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
// retirer l'ID générée par le json
    delete sauceObject._id;  
    const sauce = new Sauce({
        ...sauceObject,
// récupérer l'image et créer l'url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};