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


module.exports = router;