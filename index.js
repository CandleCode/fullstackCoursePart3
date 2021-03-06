require('dotenv').config()
const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('person', (req) => {
  if (req.body.name) {
    return JSON.stringify(req.body)
  } return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((result) => {
    response.send(`
<div>
<p>Phonebook has info for ${result} people</p>
<p>${Date()}</p>
</div>
`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'request must contain a name and a number',
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request

  const person = {
    name: body.content,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'wrong format for id' })
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } if (error.code === 11000) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  next(error)
}

app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
