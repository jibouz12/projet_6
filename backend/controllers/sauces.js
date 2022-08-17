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
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

///////////////////////////
// créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
// retirer l'ID générée par le json
    delete sauceObject._id;  
// retirer l'userID de l'objet envoyé et utiliser celui du token par sécurité
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.authorize.userId,
// récupérer l'image et créer l'url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' })})
    .catch(error => { res.status(400).json({ error })})
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
                res.status(403).json({ message: 'Utilisateur non autorisé !' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message : 'Sauce modifiée !' })) 
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

////////////////////////////////
// supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.authorize.userId) {
                res.status(403).json({ message: 'Utilisateur non autorisé !' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Sauce supprimée !' })})
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
// récupérer le "like"
    let like = req.body.like;
// récupérer l'ID du likeur
    let likeurID = req.body.userId;
// récupérer l'ID de la sauce 
    let sauceID = req.params.id;
// vérifier que le likeur ne soit pas le créateur de la sauce
    Sauce.findOne({ _id: sauceID })
    .then(sauce => {
        if (sauce.userId == req.authorize.userId) {
            res.status(403).json({ message: 'Utilisateur non autorisé !' });
        } else {
// si like = 1 --> sauce +1 like
            if (like == 1) {
                Sauce.updateOne({ _id : sauceID }, 
                {
                    $push: { usersLiked: likeurID },
                    $inc: { likes: +1 }
                })
                .then(() => { res.status(200).json({ message: 'Sauce likée !' })})
                .catch(error => res.status(401).json({ error }));
            }
// si like = -1 --> sauce +1 dislike
            if (like == -1) {
                Sauce.updateOne({ _id : sauceID }, 
                {
                    $push: { usersDisliked: likeurID },
                    $inc: { dislikes: +1 }
                })
                .then(() => { res.status(200).json({ message: 'Sauce dislikée !' })})
                .catch(error => res.status(401).json({ error }));
            }
// si like = 0 
// si on avait déjà liké --> retirer le like et id du likeur
            if (like == 0 && sauce.usersLiked.find(element => element == likeurID)) {
                Sauce.updateOne({ _id : sauceID }, 
                {
                    $pull: { usersLiked: likeurID },
                    $inc: { likes: -1 }
                })
                .then(() => { res.status(200).json({ message: 'Like annulé !' })})
                .catch(error => res.status(401).json({ error }));
            }
// si on avait déjà disliké --> retirer le dislike et id du likeur
            if (like == 0 && sauce.usersDisliked.find(element => element == likeurID)) {
                Sauce.updateOne({ _id : sauceID }, 
                {
                    $pull: { usersDisliked: likeurID },
                    $inc: { dislikes: -1 }
                })
                .then(() => { res.status(200).json({ message: 'Dislike annulé !' })})
                .catch(error => res.status(401).json({ error }));
            } 
        }})
        .catch( error => {
            res.status(500).json({ error });
        });
}