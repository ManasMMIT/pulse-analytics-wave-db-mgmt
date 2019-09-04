const { gql } = require('apollo-server-express')

const deleteSourceIndicationTypeDefs = gql`
  input DeleteSourceIndicationInput {
    _id: ID!
  }

  type DeleteSourceIndicationPayload {
    _id: ID
    name: String
  }
`

module.exports = deleteSourceIndicationTypeDefs
