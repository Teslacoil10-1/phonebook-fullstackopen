// index.js
require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const morgan = require('morgan')
const path = require('path')
const Users = require('./models/db')
const errHandler = require('./middleware/errorhandler')

// middle ware
app.use(express.json());
morgan.token('body',(req,res)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.static(path.join(__dirname,'dist')))

// http methods and endpoints

app.get('/api/persons', (req, res) => {
  Users.find({})
    .then(users => {
      res.json(users); 
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post('/api/persons',(req,res) =>{
    const body = req.body

    if (!body || !body.name || !body.number){
        return res.status(400).json({ error:'name and number is required'})
    }

    Users.findOne({ name: body.name })
        .then(user => {
            if (user){
                return res.status(400).json({ error : 'name must be unique'})
            }
            const newPerson = new Users( {
                name:body.name,
                number:body.number
        })
        newPerson.save().then(person =>{
            res.status(201).json(person)
        }).catch(err =>{
            console.error(err)
            res.status(500).json({error : 'failed to save user'})
        })
    })
        .catch(err =>{
            console.error(err)
            res.status(500).end()
        })
})

app.get('/info', async (req,res)=>{
    let len = await Users.countDocuments({})
    let time = new Date
    
    res.send(`
        <p>phonebook has info for ${len} people</p>
        <p>${time}</p>
        `)
})

app.get('/api/persons/:id',(req, res, next)=>{
    const id = req.params.id 
    
    

    Users.findById(id).then(user=>{
        if(!user){
            res.status(404).end()
        }
        res.json(user)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id',(req, res, next)=>{
    let id = req.params.id 

    Users.findByIdAndDelete(id).then(() => {res.status(204).end()}).catch(err => next(err))
    
  
})


app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errHandler)

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`running on port ${PORT}`)
    })
}

module.exports = app