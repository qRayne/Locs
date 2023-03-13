// pour créer une schema -> table 
const mongoose = require('mongoose')

// on créer un schema avec toutes nos champs et leurs types
const ChatRoomSchema = new mongoose.Schema({
    place:{
        name:String,
        location:{
            latitude:Number,
            longitude:Number
        }
    },
    users:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chats:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    isPublic:Boolean
})

// on créer le schema
mongoose.model("ChatRoom",ChatRoomSchema)