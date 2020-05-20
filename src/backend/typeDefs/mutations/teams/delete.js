const { gql } = require('apollo-server-express')

const deleteTeamTypeDefs = gql`
  input DeleteTeamInput {
    _id: ID!
    clientId: String
  }

   type DeleteTeamPayload {
    _id: ID!
    name: String!
    description: String!
    defaultLandingPath: String
  }
`

module.exports = deleteTeamTypeDefs
