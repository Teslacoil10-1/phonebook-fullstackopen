// models/db.js
require('dotenv').config()
const mongoose = require('mongoose')
const password = process.env.DBPASSWORD
const url = `mongodb+srv://nathanielW:${password}@helsinkifullstack.m8ocglr.mongodb.net/?appName=helsinkiFullstack`
mongoose.set('strictQuery',false)

mongoose
    .connect(url,{family:4})
    .then(res => {
        console.log('connected to mongo db')
    })
    .catch(err =>{
        console.error('error connecting to mongo db' ,err.message)
    })


const userSchema = new mongoose.Schema({
    name:String,
    number:Number
})

userSchema.set('toJSON',{
    transform:(doc, returnedObj) =>{
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Users', userSchema)







