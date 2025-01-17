const express = require('express')
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const cors = require('cors')
app.use(cors()) 


app.use(express.json());


  let persons = [
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
const buildpath = path.join(__dirname, '../client/build')

// api routes
app.get('/persons', (request, response) => {
    response.json(persons)
  })
// after npm run build from the frontend side
app.use(express.static(buildpath))

// Catch-all handler for any requests that don't match your API routes
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

  app.get('/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else{
        //if the person is not identified
        response.status(404).end()
    }
    
  })
  app.delete('/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/persons', (request, response)=>{
    // const id = Math.floor(Math.random() * 100)
    const id = persons.length + 1;
    const b = request.body;
    if (!b.name || !b.number){
      return response.status(400).json({
        error:'name or number missing'
      })
    }
    const nameCheckEXIST = persons.some(person => person.name === b.name)
    if (nameCheckEXIST){
      return response.status(400).json({
        error:'name must be unique'
      })
    }

    
    const newPerson ={
        id: id.toString(),
        name: b.name,
        number: b.number
    };
    persons = persons.concat(newPerson)
    response.json(newPerson);
  })

  app.put('/persons/:id', (request, response)=>{
    const id = request.params.id
    const index = persons.findIndex(person => person.id === id);

    const updatePerson = request.body
    
    if (index === -1){
      return response.status(400).json({
        error:'person is not identified'
      })
    }
    persons[index].name = updatePerson.name
    persons[index].number = updatePerson.number
    
    response.json(persons[index])
    
  })



  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })