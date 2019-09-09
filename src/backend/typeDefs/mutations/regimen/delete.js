const { gql } = require('apollo-server-express')

const deleteSourceRegimenTypeDefs = gql`
  input DeleteSourceRegimenInput {
    _id: ID!
  }

  type DeleteSourceRegimenPayload {
    _id: ID!
    name: String!
    products: [Product!]!
  }
`

module.exports = deleteSourceRegimenTypeDefs
