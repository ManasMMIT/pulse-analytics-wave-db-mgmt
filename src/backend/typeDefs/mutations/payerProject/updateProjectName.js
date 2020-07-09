const { gql } = require('apollo-server-express')

const updatePayerProjectNameTypeDefs = gql`
  input UpdatePayerProjectNameInput {
    _id: ID!
    name: String!
  }
`

module.exports = updatePayerProjectNameTypeDefs
