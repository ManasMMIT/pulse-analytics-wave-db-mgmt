const createConnection = require('./createConnection')
const createVbmParticipant = require('./createVbmParticipant')
const createVbmParticipation = require('./createVbmParticipation')
const deleteVbmConnection = require('./deleteVbmConnection')

module.exports = [
  createConnection,
  createVbmParticipant,
  createVbmParticipation,
  deleteVbmConnection,
]
