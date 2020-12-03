const { gql } = require('apollo-server-express')

const deletePathwaysAndPersonConnectionTypeDefs = gql`
  input DeleteObmAndPayerConnectionInput {
    _id: ID!
  }
`

module.exports = deletePathwaysAndPersonConnectionTypeDefs
