const { gql } = require('apollo-server-express')

const updateAquilaConfigTypeDefs = gql`
  input UpdateAquilaConfigInput {
    _id: ID!
    label: String!
    boId: ID # not used by resolver, but added here b/c frontend reuses form inputs for create and update
  }
`

module.exports = updateAquilaConfigTypeDefs
