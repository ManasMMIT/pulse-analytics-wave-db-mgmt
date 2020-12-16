const { gql } = require('apollo-server-express')

const deleteObmTypeTypeDefs = gql`
  input DeleteObmTypeInput {
    _id: ID!
  }

  type DeleteObmTypePayload {
    _id: ID
    name: String
    description: String
  }
`

module.exports = deleteObmTypeTypeDefs
