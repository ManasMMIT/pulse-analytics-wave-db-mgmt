const { gql } = require('apollo-server-express')

const deleteObmAndPayerConnectionTypeDefs = gql`
  input DeleteObmAndPayerConnectionInput {
    _id: ID!
  }
`

module.exports = deleteObmAndPayerConnectionTypeDefs
