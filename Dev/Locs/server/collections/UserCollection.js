// pour créer une schema -> table 
const mongoose = require('mongoose')


// on créer un schema avec toutes nos champs et leurs types
const UserSchema = new mongoose.Schema({
    email:String,
    location:{
        latitude:Number,
        longitude:Number
    },
    password:String,
    profile:{
        username:String,
        pronouns:String,
        avatar:String,
        interests:String,
        firstName:String,
        lastName:String,
        age:Number,
        facialPhoto:Buffer,
        socialMediaLinks:[String],
        occupation:String
    },
    status:Boolean
})

// on créer le schema
mongoose.model("User",UserSchema)