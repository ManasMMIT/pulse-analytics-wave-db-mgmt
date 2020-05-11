const { gql } = require('apollo-server-express')

const deleteBusinessObjectTypeDefs = gql`
  input DeleteBusinessObjectInput {
    _id: ID!
  }
`

module.exports = deleteBusinessObjectTypeDefs
