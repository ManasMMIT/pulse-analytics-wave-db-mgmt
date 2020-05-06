const { gql } = require('apollo-server-express')

const deleteLineTypeDefs = gql`
  input DeleteLineInput {
    _id: ID!
  }

  type DeleteLinePayload {
    _id: ID
    name: String
  }
`

module.exports = deleteLineTypeDefs
