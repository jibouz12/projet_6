const Sauce = require("../models/Sauce");
const fs = require('fs');


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

//////////////////////////////
// modifier sauce
exports.modifySauce = (req, res, next) => {
// regarder si l'utilisateur télécharge une nouvelle image ou pas
// si oui --> remplacer par la nouvelle
// si non --> garder l'image 
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
// retirer l'ID générée par le json
    delete sauceObject._id;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.authorize.userId) {   
                res.status(401).json({ message: 'Non autorisé !'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié !'})) 
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

////////////////////////////////
// supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.authorize.userId) {
                res.status(401).json({message: 'Non autorisé !'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

////////////////////////
// liker / disliker les sauces
exports.likeSauce = (req, res, next) => {

};