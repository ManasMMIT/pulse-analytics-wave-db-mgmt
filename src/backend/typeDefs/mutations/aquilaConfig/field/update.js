const { gql } = require('apollo-server-express')

const updateAquilaConfigFieldTypeDefs = gql`
  input UpdateAquilaConfigFieldInput {
    _id: ID!
    label: String!
    aquilaConfigId: ID!
    inputProps: String! # object is passed JSON.stringify from frontend
    boFieldId: ID # form is shared between update and create, so boFieldId is stubbed to stop breakage
  }
`

module.exports = updateAquilaConfigFieldTypeDefs
