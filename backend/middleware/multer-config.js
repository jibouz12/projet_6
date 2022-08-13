const multer = require('multer');

//////////////////////
// créer un dictionnaire de types possibles d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/////////////////////////////
// créer fichier image avec nom unique et enregistrer 
// destination --> dossier "images"
// filename --> remplacer les espaces du nom original par des "_"
//          --> récupérer l'extention de l'image
// ---> nom original modifié + date en millisecondes + . + extension
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');