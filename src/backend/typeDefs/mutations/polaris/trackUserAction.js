const { gql } = require('apollo-server-express')

const trackUserActionTypeDefs = gql`
  input TrackUserActionInput {
    user: JSON!
    action: String!
    limit: Int
  }

  type TrackUserActionPayload {
    latest: UserAction
    history: [UserAction]
  }
`

module.exports = trackUserActionTypeDefs
