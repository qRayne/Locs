// pour créer une schema -> table 
const ChatSchema = require('./ChatCollection')
const mongoose = require('mongoose')

// on créer un schema avec toutes nos champs et leurs types
const ChatRoomSchema = new mongoose.Schema({
    place:{
        location:{
            latitude:Number,
            longitude:Number
        }
    },
    //users:[usersSchema],
    chats:[ChatSchema],
    isPublic:Boolean
})

// on créer le schema
mongoose.model("chatRoom",ChatRoomSchema)