const { gql } = require('apollo-server-express')

const createTeamTypeDefs = gql`
  input CreateTeamInput {
    description: String!
    clientId: String!
  }

  type CreateTeamPayload {
    _id: ID!
    name: String
    description: String
    isDefault: Boolean
    sitemap: JSON
    client: Client
  }
`

module.exports = createTeamTypeDefs
