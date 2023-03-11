const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require("./ChatCollection")

// va parser le data recupérer en get/post en format json
app.use(bodyParser.json())

const mongoUri = "mongodb+srv://root:5zzsRE6k9NXRzm3n@clusterlocs.uc7x8tm.mongodb.net/?retryWrites=true&w=majority"

const Chat = mongoose.model("chat")

// tout ce qui est connection à la db
// connexion à la db
mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}) 

// si la connection ne génère aucune erreur
mongoose.connection.on("connected",()=>{
    console.log("connected to mongo");
})

// si la connection génère une erreur
mongoose.connection.on("error",(err)=>{
    console.log(err);
})


// tout ce qui est lier au server node.js
app.get('/',(req,res)=>{
    
})

app.listen(3000,()=>{
    console.log("server running");
})


// pour delete un data dans notre db
app.post('/delete',(req,res)=>{
    Chat.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data);
        res.send("deleted")
    })
})

// pour send un chat
app.post('/send-chat', async (req,res) =>{
    const chat = new Chat(req.body)
    await chat.save().then(() => console.log(chat))
    res.send('chat sent ')
})