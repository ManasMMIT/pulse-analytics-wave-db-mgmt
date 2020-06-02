const { gql } = require('apollo-server-express')

const createAquilaConfigFieldTypeDefs = gql`
  input CreateAquilaConfigFieldInput {
    label: String!
    aquilaConfigId: ID!
    boFieldId: ID!
    inputProps: String! # object is passed JSON.stringify from frontend
  }
`

module.exports = createAquilaConfigFieldTypeDefs
