const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//////////////////////////////
// modele user 
// unique --> impossible d'avoir 2 utilisateurs avec le même email
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);