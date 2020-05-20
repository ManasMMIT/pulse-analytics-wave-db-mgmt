const { gql } = require('apollo-server-express')

const createTeamTypeDefs = gql`
  input CreateTeamInput {
    _id: String # not required but same form is used by update team so this comes in as null and needs typeDef
    description: String!
    clientId: String!
    defaultLandingPath: String!
  }

  type CreateTeamPayload {
    _id: ID!
    name: String
    description: String
    isDefault: Boolean
    sitemap: JSON
    client: Client
    resources: JSON
    defaultLandingPath: String
  }
`

module.exports = createTeamTypeDefs
