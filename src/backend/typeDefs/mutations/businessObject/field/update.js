const { gql } = require('apollo-server-express')

const updateBusinessObjectFieldTypeDefs = gql`
  input UpdateBusinessObjectFieldInput {
    businessObjectId: ID!
    field: BoFieldInput! # from create typedef
  }
`

module.exports = updateBusinessObjectFieldTypeDefs
