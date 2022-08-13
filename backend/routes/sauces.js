const express = require('express');
const saucesCtrl = require("../controllers/sauces");

const router = express.Router();

  
///////////////////////////
// routes 
router.get('/', saucesCtrl.getAllSauces);


module.exports = router;