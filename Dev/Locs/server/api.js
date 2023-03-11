const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongooseConnection = require('./connection')
require("./collections/ChatCollection")
require("./collections/ChatRoomCollection")

// va parser le data recupérer en get/post en format json
server.use(bodyParser.json())


server.get('/',(req,res)=>{
    res.send("localhost")
})


// pour tout ce qui est post/get pour le chat ↓
// pour delete un chat dans notre db
// cette methode recupère l'id inscrit dans l'url => id d'un message
// va dans la collection chat et l'enlève 
// s'il n'est pas enlever -> c'est qu'il n'existe pas
server.post('/delete-chat', async (req, res) => {
    const Chat = mongooseConnection.model("chat");
    const id = req.query._id;
    try {
        const deletedChat = await Chat.findByIdAndRemove(id).exec();
        if (!deletedChat) {
            throw new Error('Chat not found');
        }
        res.send(deletedChat);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// pour send un chat
server.post('/send-chat', async (req,res) =>{
    const Chat = mongooseConnection.model("chat");
    const chat = new Chat(req.body)
    await chat.save().then(() => console.log(chat))
    res.send('chat sent ')
})

// pour avoir la liste de chats d'un sender
server.get('/chat-sender', async (req, res) => {
    const Chat = mongooseConnection.model("chat");
    const sender = req.query.sender;
    const chats = await Chat.find({ sender: sender });
    res.send(chats);
})

// pour instancier un server dans notre localhost et le demarrer
server.listen(3000,()=>{
    console.log("server running");
})