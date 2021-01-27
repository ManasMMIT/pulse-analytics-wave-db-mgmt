const { gql } = require('apollo-server-express')

const updateObmServiceTypeDefs = gql`
  input UpdateObmServiceInput {
    id: ID!
    name: String!
    description: String
    category_id: String
  }

  type UpdateObmServicePayload {
    id: ID!
    name: String!
    description: String
  }
`

module.exports = updateObmServiceTypeDefs
