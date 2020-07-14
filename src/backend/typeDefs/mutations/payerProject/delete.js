const { gql } = require('apollo-server-express')

const deletePayerProject = gql`
  input DeletePayerProjectInput {
    _id: ID!
  }

  type DeletePayerProjectPayload {
    _id: ID!
    name: String
  }
`

module.exports = deletePayerProject
