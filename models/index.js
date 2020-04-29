const Sequelize = require('sequelize')
const VillainsModel = require('./villains')

const connection = new Sequelize('villains', 'jafar', 'Ursula##', {
  host: 'localhost', dialect: 'mysql',
})

const Villains = VillainsModel(connection, Sequelize)

module.exports = { Villains }
