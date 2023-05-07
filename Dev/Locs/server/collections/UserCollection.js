// pour créer une schema -> table 
const mongoose = require('mongoose')


// on créer un schema avec toutes nos champs et leurs types
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true,required: true },
    password: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
});

// on créer le schema
mongoose.model("User", UserSchema)