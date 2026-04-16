// index.js

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const morgan = require('morgan')
const path = require('path')

let hardCodedValues = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


// middle ware
app.use(express.json());
morgan.token('body',(req,res)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.static(path.join(__dirname,'dist')))

//http meathods and endpoints



app.get('/api/persons',(req,res)=>{
    res.json(hardCodedValues)
})

app.post('/api/persons',(req,res)=>{
    const body = req.body

    if (!body || !body.name || !body.number){
        return res.status(400)
    }

    if(hardCodedValues.some(user => user.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({
            error:'name must be unique'
        })
    }
    const newPerson = {
        id:String(Math.floor(Math.random() * 100000)),
        name:body.name,
        number:body.number
    }

    hardCodedValues = [...hardCodedValues, newPerson]
    res.status(201).json(newPerson)
})

app.get('/info',(req,res)=>{
    let len = hardCodedValues.length
    let time = new Date

    res.send(`
        <p>phonebook has info for ${len} people</p>
        <p>${time}</p>
        `)
})

app.get('/api/persons/:id',(req, res)=>{
    const id = req.params.id 
    
    
    if(!id){
        res.status(404)
    }

    res.json(hardCodedValues.find(item => item.id === id))
})

app.delete('/api/persons/:id',(req, res)=>{
    let id = req.params.id 

    hardCodedValues = hardCodedValues.filter(item=>item.id !== id)

    console.log(hardCodedValues)
    res.status(204).end()
  
})


app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`running on port ${PORT}`)
    })
}

module.exports = app