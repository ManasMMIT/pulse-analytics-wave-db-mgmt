const { gql } = require('apollo-server-express')

const createVbmParticipantTypeDefs = gql`
  input CreateVbmParticipantInput {
    from: JSON!
    to: JSON!
    state: String
  }
`

module.exports = createVbmParticipantTypeDefs
