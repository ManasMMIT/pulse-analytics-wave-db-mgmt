const { gql } = require('apollo-server-express')

const deleteAquilaConfigFieldTypeDefs = gql`
  input DeleteAquilaConfigFieldInput {
    _id: ID!
    aquilaConfigId: ID!
  }
`

module.exports = deleteAquilaConfigFieldTypeDefs
