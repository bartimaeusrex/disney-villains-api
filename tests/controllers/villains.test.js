const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  before, beforeEach, afterEach, after, describe, it
} = require('mocha')
const { villainsList, singleVillain, postedVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Villains', () => {
  let sandbox
  let stubbedCreate
  let stubbedFindOne
  let stubbedFindAll
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedCreate = sandbox.stub(models.Villains, 'create')
    stubbedFindAll = sandbox.stub(models.Villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.Villains, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the list', async () => {
      stubbedFindAll.returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })

    it('returns a 500 status when an error occurs retrieving the villains', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villain list, please try again.')
    })
  })

  describe('getVillainBySlug', () => {
    // eslint-disable-next-line max-len
    it('retrieves the villain associated with the provided slug from the database and calls response.send with it', async () => {
      const request = { params: { slug: 'miss-america' } }

      stubbedFindOne.returns(singleVillain)

      await getVillainBySlug(request, response)

      // eslint-disable-next-line max-len
      expect(stubbedFindOne).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'], where: { slug: 'miss-america' } })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 404 status when no villain is found', async () => {
      const request = { params: { slug: 'goofy' } }

      stubbedFindOne.returns(null)

      await getVillainBySlug(request, response)

      // eslint-disable-next-line max-len
      expect(stubbedFindOne).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'], where: { slug: 'goofy' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 status when an error occurs retrieving the villain by slug', async () => {
      const request = { params: { slug: 'batman' } }

      stubbedFindOne.throws('ERROR!')

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villain, please try again.')
    })
  })


  describe('saveNewVillain', () => {
    // eslint-disable-next-line max-len
    it('accepts new villain details and saves them as a new villain, returning the saved record with a 201 status', async () => {
      const request = { body: singleVillain }

      stubbedCreate.returns(singleVillain)

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 400 status when not all required fields are provided (missing movie)', async () => {
      const { name, slug } = postedVillain
      const request = { body: { name, slug } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      // eslint-disable-next-line max-len
      expect(stubbedStatusDotSend).to.have.been.calledWith('The following fields are required: name, movie, slug')
    })

    // eslint-disable-next-line max-len
    it('returns a 500 when an error occurs saving the new villain', async () => {
      const request = { body: postedVillain }

      stubbedCreate.throws('ERROR!')

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(postedVillain)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save new villain, please try again.')
    })
  })
})
