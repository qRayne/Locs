const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongooseConnection = require('./connection')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../config')
const jwt = require('jsonwebtoken')
require("./collections/ChatCollection")
require("./collections/ChatRoomCollection")
require("./collections/UserCollection")
require("./collections/ProfileCollection")

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
server.post('/chatroom-sendChat/:name', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const Chat = mongooseConnection.model("Chat");
    const User = mongooseConnection.model("User");
    const { name } = req.params;
    const { sender, message, timestamp } = req.body;

    try {
        const chatRoom = await ChatRoom.findOne({ 'place.name': name }).populate('users chats');

        if (!chatRoom) {
            return res.status(404).send('Chat room not found');
        }

        const senderUser = await User.findOne({ 'profile.username': sender });

        if (!senderUser) {
            return res.status(404).send('Sender not found');
        }


        const chat = new Chat({ sender: senderUser._id, message, timestamp });

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
    console.log(chatRoomObject);
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
// prend en paramètre un nom et retourne les donnes d'un chat room localisation,isPublic
server.get('/chatRoom-info', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const name = req.query.name;
    const returnedChatRoomObject = await ChatRoom.findOne({ 'place.name': name });
    res.send(returnedChatRoomObject);
})

// pour recuperer les messages d'un chatroom avec le username et le timestamp
// on recupère tous les id des chats dans le chatroom et on get tous leurs infos qui eux sont dans une autre collection
server.get('/chatRoom-messages', async (req, res) => {
    const ChatRoom = mongooseConnection.model("ChatRoom");
    const Chats = mongooseConnection.model("Chat");
    const Profiles = mongooseConnection.model("Profile");
    const Users = mongooseConnection.model("User");

    const name = req.query.name;
    const returnedChatRoomObject = await ChatRoom.findOne({ 'place.name': name });

    const chatIds = returnedChatRoomObject.chats;

    const chats = await Chats.find({ _id: { $in: chatIds } }).populate({
        path: 'sender',
        model: Users,
        populate: {
            path: 'profile',
            model: Profiles,
        },
    });

    const messageHistory = chats.map(chat => ({
        message: chat.message,
        sender: chat.sender.profile.username, // assuming that the `Profile` model has a `username` field
        timestamp: chat.timestamp,
    }));

    res.send(messageHistory);
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
    userObject.profile = null; // il est pour le moment null

    const hashedPassword = await bcrypt.hash(userObject.password, 10);
    userObject.password = hashedPassword;

    await userObject.save().then(() => console.log(userObject));
    res.send(userObject._id);
});

// pour register un profil
// on utilisera l'id pour register un user parce que le username n'est pas encore defini 
// vu qu'il est dans un souschema profil
server.post('/create-Profile-User/:user_id', async (req, res) => {
    const Profile = mongooseConnection.model('Profile');
    const User = mongooseConnection.model('User');
    const user_id = req.params.user_id;
    const profilObject = new Profile(req.body);

    try {
        // on trouve le user
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(401).json({ message: 'user does not exist' });
        }

        // on créer le user 
        await profilObject.save();

        // on prend l'id du profil créer et on le met dans le profile du user
        user.profile = profilObject._id;
        await user.save();

        res.json({ message: 'Profile initialised' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }


})
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

        // on creer un token d'authentification
        // on passe aussi le username dans le token pour pouvoir send des chats
        const token = jwt.sign({ userId: user._id, username: user.profile.username }, JWT_SECRET);

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// pour recuperer les infos d'un usager
server.get("/User-info", async (req, res) => {
    const User = mongooseConnection.model("User");
    const username = req.query.username;
    const returnUserObject = await User.findOne({ 'profile.username': username });
    res.send(returnUserObject);
})
