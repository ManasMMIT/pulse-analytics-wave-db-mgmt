const { gql } = require('apollo-server-express')

const createAquilaConfigTypeDefs = gql`
  input CreateAquilaConfigInput {
    label: String!
    boId: ID!
  }
`

module.exports = createAquilaConfigTypeDefs
