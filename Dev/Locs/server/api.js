const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongooseConnection = require('./connection')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../react-native.config')
const jwt = require('jsonwebtoken')
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


// pour send un chat dans un chat Room
// il faut le nom du chatRoom
// creer une instance de chat et l'envoie dans la liste de chats du chatRoom
server.post('/chatroom/:name', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const Chat = mongooseConnection.model("Chat");
    const { name } = req.params;
    const { sender, message, timestamp } = req.body;

    try {
        const chatRoom = await ChatRoom.findOne({ 'place.name': name }).populate('users chats');

        if (!chatRoom) {
            return res.status(404).send('Chat room not found');
        }
        const chat = new Chat({ sender, message, timestamp, });

        chatRoom.chats.push(chat);
        await chat.save();
        await chatRoom.save();

        res.status(201).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});





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
server.post('/delete-chatRoom', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const name = req.query.name;
    const returnChatRoomObject = await ChatRoom.findOneAndDelete({ 'place.name': name });
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
    const ChatRoom = mongooseConnection.model("ChatRoom");

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
    const ChatRoom = mongooseConnection.model("ChatRoom");

    try {
        const user = await User.findOne({ 'profile.username': username });

        if (!user) {
            return res.status(404).send('User not found');
        }

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


// pour tout ce qui post/get pour le user
// pour register un user 
server.post('/create-User', async (req, res) => {
    const User = mongooseConnection.model('User');
    const userObject = new User(req.body);

    const hashedPassword = await bcrypt.hash(userObject.password,10);
    userObject.password = hashedPassword;

    await userObject.save().then(() => console.log(userObject));
    res.send('created a new user');
});

// pour login un user
// si le login est successful on generer un token
// le token doit être enregister avec un local storage (asyncStorage en react-native)
server.post('/login-User', async (req, res) => {
    const { email, password } = req.body;
    const User = mongooseConnection.model('User');

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// pour recuperer les infos d'un usager
server.get("/User-info",async(req,res)=>{
    const User = mongooseConnection.model("User");
    const username = req.query.username;
    const returnUserObject = await User.findOne({ 'profile.username': username });
    res.send(returnUserObject);
})

// pour updater les infos d'un usager
// ici c'est la geolocalisation qui doit être updater à chaque x temps
server.post("/User-updateLocation",async(req,res)=>{
    const User = mongooseConnection.model("User");
})
