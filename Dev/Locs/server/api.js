require("./collections/ChatCollection")
require("./collections/ChatRoomCollection")
require("./collections/UserCollection")
require("./collections/ProfileCollection")
const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const mongooseConnection = require('./connection')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../config')
const jwt = require('jsonwebtoken')
const ChatRoom = mongooseConnection.model("ChatRoom")
const Chat = mongooseConnection.model("Chat")
const User = mongooseConnection.model("User")
const Profile = mongooseConnection.model('Profile')

// va parser le data recupérer en get/post en format json
// on augmente la limite à cause de la taille des images 
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


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
    const { name } = req.params;
    const { sender, message, timestamp } = req.body;

    try {
        const chatRoom = await ChatRoom.findOne({ 'place.name': name }).populate('users chats');

        if (!chatRoom) {
            return res.status(404).send('Chat room not found');
        }

        const profileID = await Profile.findOne({ username: sender });
        const senderUser = await User.findOne({ profile: profileID });


        if (!senderUser) {
            return res.status(404).send('Sender not found');
        }

        const addUserToChatRoom = await ChatRoom.findOneAndUpdate(
            { 'place.name': name },
            { $addToSet: { users: senderUser._id } },
            { new: true }
        );

        if (!addUserToChatRoom) {
            return res.status(404).send('User cannot be added');
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
    const { place: { name } } = req.body;


    // Check if a chatroom with the same name already exists
    const existingChatRoom = await ChatRoom.findOne({ 'place.name': name });


    if (existingChatRoom) {
        return res.status(400).json('A chatroom with this name already exists');
    }

    const chatRoomObject = new ChatRoom(req.body);

    await chatRoomObject.save().then(() => console.log(chatRoomObject));
});

// pour savoir si un chatroom existe deja
server.get("/check-privateChatroom", async (req, res) => {
    const name = req.query.name;
    const existingChatRoom = await ChatRoom.findOne({ 'place.name': name });

    if (existingChatRoom) {
        return res.send("A chatroom with this name already exists");
    }

    return res.send("The chatroom doesnt exist");
})



// pour supprimer un chatRoom
// prend en paramètre le nom du room
server.post('/delete-chatRoom', async (req, res) => {
    const name = req.query.name;
    const returnChatRoomObject = await ChatRoom.findOneAndDelete({ 'place.name': name });
    res.send(returnChatRoomObject);
})


// pour recuperer les messages d'un chatroom avec le username et le timestamp
// on recupère tous les id des chats dans le chatroom et on get tous leurs infos qui eux sont dans une autre collection
server.get('/chatRoom-messages', async (req, res) => {
    const name = req.query.name;
    const chatRoom = await ChatRoom.findOne({ 'place.name': name }).populate('users chats');
    const chatIds = chatRoom.chats;

    const chats = await Chat.find({ _id: { $in: chatIds } }).populate({
        path: 'sender',
        model: User,
        populate: {
            path: 'profile',
            model: Profile,
        },
    });

    const messageHistory = chats.map(chat => ({
        message: chat.message,
        sender: chat.sender.profile.username,
        avatar: chat.sender.profile.avatar,
        timestamp: chat.timestamp,
    }));


    res.send({
        messageHistory: messageHistory,
        isPublic: chatRoom.isPublic
    });
})

// pour tout ce qui post/get pour le user
// pour register un user 
server.post('/create-User', async (req, res) => {
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

        const profile = await Profile.findById(user.profile);

        const token = jwt.sign({ userId: user._id, username: profile.username }, JWT_SECRET);

        return res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// pour recuperer les infos d'un usager
server.get("/profil-info", async (req, res) => {
    const username = req.query.username;
    const returnProfileObject = await Profile.findOne({ username: username });
    res.send(returnProfileObject);
})


// pour acceder a tout les private conversation d'un user:
server.get("/user-private-messages",async(req,res)=>{
    const username = req.query.username;
    const chatroomsReturnedObjects = await ChatRoom.find({
        'place.name': new RegExp(username,"i") // tous les chatrooms qui ont le nom du username
    })
    res.send(chatroomsReturnedObjects);
})