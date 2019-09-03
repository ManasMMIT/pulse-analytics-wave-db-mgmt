const { gql } = require('apollo-server-express')

const createIndicationTypeDefs = gql`
  input CreateIndicationInput {
    name: String!
  }

  type CreateIndicationPayload {
    _id: ID
    name: String
  }
`

module.exports = createIndicationTypeDefs
