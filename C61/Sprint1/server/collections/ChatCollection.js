// pour créer une schema -> table 
const mongoose = require('mongoose')

// on créer un schema avec toutes nos champs et leurs types
const ChatSchema = new mongoose.Schema({
    sender:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message:String,
    timestamp:Date
})

// on créer le schema
mongoose.model("Chat",ChatSchema)