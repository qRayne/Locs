// pour créer une schema -> table 
const mongoose = require('mongoose')


// on créer un schema avec toutes nos champs et leurs types
const ProfileSchema = new mongoose.Schema({
    username:{type:String,unique:true,required:true}, // profil public
    pronouns:{type:String,required:true},// profil public
    avatar:{type:String,required:true}, // profil public
    interests:{type:String,required:true} ,// profil public
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    age:{type:Number,required:true},
    facialPhoto:{type:String,required:true},
    socialMediaLinks:{type:[String],required:true},
    occupation:{type:String,required:true},
    DeLocdList : {type:[String]}
})

// on créer le schema
mongoose.model("Profile",ProfileSchema)