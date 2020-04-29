const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.Villains.findAll({
    attributes: ['name', 'movie', 'slug']
  })

  return response.send(villains)
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const matchingVillain = await models.Villains.findOne({
    attributes: ['name', 'movie', 'slug'],
    where: { slug }
  })

  return matchingVillain
    ? response.send(matchingVillain)
    : response.sendStatus(404)
}

const saveNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response
      .status(400)
      .send('The following fields are required: name, movie, slug')
  }

  const newVillain = await models.Villains.create({ name, movie, slug })

  return response.status(201).send(newVillain)
}

module.exports = { getAllVillains, getVillainBySlug, saveNewVillain }
