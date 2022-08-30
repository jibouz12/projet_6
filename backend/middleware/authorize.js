const jwt = require('jsonwebtoken');
require('dotenv').config();

///////////////////////////////////////
// authentification token
// récupération du token ( retirer "Bearer" devant le token avec split au niveau de l'espace et [1] pour 2eme colonne du tableau --> token)
// décoder le token avec verify
// récupérer le userID dans le token
// insérer userID dans le req.auth qui sera transmis par la suite aux routes appelées
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, "" + process.env.CLE_SECRETE);
       const userId = decodedToken.userId;
       req.authorize = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};