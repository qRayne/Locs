// pour créer une schema -> table 
const mongoose = require('mongoose')


// on créer un schema avec toutes nos champs et leurs types
const UserSchema = new mongoose.Schema({
    email:String, 
    location:String, 
    password:String,
    profile : { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
})

// on créer le schema
mongoose.model("User",UserSchema)