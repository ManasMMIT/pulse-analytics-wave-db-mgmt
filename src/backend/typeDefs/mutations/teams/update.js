const { gql } = require('apollo-server-express')

const updateTeamTypeDefs = gql`
  input UpdateTeamInput {
    _id: ID!
    description: String!
  }

  type UpdateTeamPayload {
    _id: ID!
    name: String
    description: String
    sitemap: JSON
    client: Client
  }
`

module.exports = updateTeamTypeDefs
