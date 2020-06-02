const { gql } = require('apollo-server-express')

const deleteAquilaConfigTypeDefs = gql`
  input DeleteAquilaConfigInput {
    _id: ID!
  }
`

module.exports = deleteAquilaConfigTypeDefs
