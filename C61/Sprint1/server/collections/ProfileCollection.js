// pour créer une schema -> table 
const mongoose = require('mongoose')


// on créer un schema avec toutes nos champs et leurs types
const ProfileSchema = new mongoose.Schema({
    username:{type:String,unique:true,required:true}, // profil public
    pronouns:String, // profil public
    avatar:String, // profil public
    interests:String, // profil public
    firstName:String,
    lastName:String,
    age:Number,
    facialPhoto:Buffer,
    socialMediaLinks:[String],
    occupation:String
})

// on créer le schema
mongoose.model("Profile",ProfileSchema)