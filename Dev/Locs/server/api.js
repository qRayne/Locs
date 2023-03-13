const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongooseConnection = require('./connection')
require("./collections/ChatCollection")
require("./collections/ChatRoomCollection")
require("./collections/UserCollection")

// va parser le data recupérer en get/post en format json
server.use(bodyParser.json())


server.get('/', (req, res) => {
    res.send("localhost")
})



// pour instancier un server dans notre localhost et le demarrer
server.listen(3000, () => {
    console.log("server running");
})

// pour tout ce qui est post/get pour le chat ↓
// pour delete un chat dans notre db
// cette methode recupère l'id inscrit dans l'url => id d'un message
// va dans la collection chat et l'enlève 
// s'il n'est pas enlever -> c'est qu'il n'existe pas
server.post('/delete-chat', async (req, res) => {
    const Chat = mongooseConnection.model("Chat");
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
server.post('/send-chat', async (req, res) => {
    const Chat = mongooseConnection.model("Chat");
    const chatObject = new Chat(req.body);
    await chatObject.save().then(() => console.log(chatObject));
    res.send('chat sent');
})

// pour avoir la liste de chats d'un sender
server.get('/chat-sender', async (req, res) => {
    const Chat = mongooseConnection.model("Chat");
    const sender = req.query.sender;
    const chats = await Chat.find({ sender: sender });
    res.send(chats);
})


// pour tout ce qui est post/get pour le chatRoom
// ici c'est pour creer un chatRoom
// lorsqu'on creer un chatRoom, il n'y a pas de chat et de users
// c'est à eux même de s'ajouter dans le chatRoom
server.post('/create-chatRoom', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const chatRoomObject = new ChatRoom(req.body);
    await chatRoomObject.save().then(() => console.log(chatRoomObject));
    res.send('created a new chat Room');
})

// pour supprimer un chatRoom
// prend en paramètre le nom du room
server.post('/delete-chatRoom',async(req,res) =>{
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const name = req.query.name;
    const returnChatRoomObject = await ChatRoom.findOneAndDelete({'place.name':name});
    res.send(returnChatRoomObject);
})

// pour recuperer les donnes d'un chatRoom 
// prend en paramètre un nom et retourne les donnes d'un chat room {users,chats,localisation,isPublic)
server.get('/chatRoom-info', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const name = req.query.name;
    const returnedChatRoomObject = await ChatRoom.findOne({ 'place.name': name });
    res.send(returnedChatRoomObject);
})

// pour ajouter un user à un chatRoom
// on recupère d'abord le user qui a un username 
// après on recupère le user et on update le chatRoom avec ce user
// il faut donc passer le nom du chatRoom ainsi que le username 
server.post('/chatroom/:name/addUser', async (req, res) => {
    const chatroomName = req.params.name;
    const { username } = req.body;
    const User = mongooseConnection.model("User");

    try {
        const user = await User.findOne({ 'profile.username': username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const chatroom = await ChatRoom.findOneAndUpdate(
            { 'place.name': chatroomName },
            { $addToSet: { users: user._id } },
            { new: true }
        );

        if (!chatroom) {
            return res.status(404).send('Chatroom not found');
        }

        res.json(chatroom);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// pour enlever un user à un chatRoom s'il ne respecte pas les conditions
// on recupère d'abord le user qui a un username 
// après on recupère le user et on enleve le user de ce chatRoom
// il faut donc passer le nom du chatRoom ainsi que le username 
server.post('/chatroom/:name/removeUser', async (req, res) => {
    const chatroomName = req.params.name;
    const { username } = req.body;
    const User = mongooseConnection.model("User");

    try {
        // Find the user by username
        const user = await User.findOne({ 'profile.username': username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the chatroom by name and update the users array
        const chatroom = await ChatRoom.findOneAndUpdate(
            { 'place.name': chatroomName },
            { $pull: { users: user._id } },
            { new: true }
        );

        if (!chatroom) {
            return res.status(404).send('Chatroom not found');
        }

        res.json(chatroom);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});