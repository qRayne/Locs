const mongoose = require('mongoose');

const mongoUri = "mongodb+srv://root:5zzsRE6k9NXRzm3n@clusterlocs.uc7x8tm.mongodb.net/locs?retryWrites=true&w=majority"

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

module.exports = mongoose.connection;