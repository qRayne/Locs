const express = require('express')
const app = express()
const bodyParsre = require('body-parser')
const mongoose = require('mongoose')

password = 

app.get('/',(req,res)=>{
    res.send("welcome to node js")
})

app.listen(3000,()=>{
    console.log("server running");
})