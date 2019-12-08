const { gql } = require('apollo-server-express')

const createVbmParticipationTypeDefs = gql`
  input CreateVbmParticipationInput {
    from: JSON!
    to: JSON!
    state: String
  }
`

module.exports = createVbmParticipationTypeDefs
