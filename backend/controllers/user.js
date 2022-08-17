const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/////////////////////
// inscription 
// hachage du password
// création nouvel utilisateur
// ( vérification que le mail est unique dans models )
exports.signup = (req, res, next) => {
    let regexEmail = /[a-zA-Z1-9.-_]+[@]+[a-zA-Z1-9.-_]+[.]+[a-z]/;
    if (regexEmail.test(req.body.email)) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
            email: req.body.email,
            password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error : "erreur" }));
    } else {
        return res.status(500).json({ message : "Respectez un format Email valide !" });
    }
  };

//////////////////////////////////////
// connexion
// cherche si mail existe:
// si non --> erreur 401
// si oui --> compare le password :
// si password différent --> erreur 401
// si password ok --> userId + Token ( token contient userId, token et est valable 24h)
exports.login = (req, res, next) => {
User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'CLE_SECRETE_POUR_ENCODAGE_DU_TOKEN',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};