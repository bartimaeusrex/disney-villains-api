const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, getVillainById, saveNewVillain } = require('./controllers/villains')

const app = express()

app.get('/', getAllVillains)

app.get('/:id', getVillainById)

app.post('/', bodyParser.json(), saveNewVillain)

app.listen(8080, () => {
  console.log('Listening on port 8080...') // eslint-disable-line no-console
})
