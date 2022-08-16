const express = require('express');
const auth = require("../middleware/authorize");
const saucesCtrl = require("../controllers/sauces");
const authorize = require('../middleware/authorize');
const multer = require("../middleware/multer-config");

const router = express.Router();

  
///////////////////////////
// routes 
router.get('/', authorize, saucesCtrl.getAllSauces);
router.post('/', authorize, multer, saucesCtrl.createSauce);
router.get('/:id', authorize, multer, saucesCtrl.getOneSauce);
router.put('/:id', authorize, multer, saucesCtrl.modifySauce);
router.delete('/:id', authorize, multer, saucesCtrl.deleteSauce);
router.post('/:id/like', authorize, saucesCtrl.likeSauce);


module.exports = router;