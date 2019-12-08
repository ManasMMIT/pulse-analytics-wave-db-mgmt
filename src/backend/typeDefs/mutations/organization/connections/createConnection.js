const { gql } = require('apollo-server-express')

const createConnectionTypeDefs = gql`
  input CreateConnectionInput {
    from: JSON!
    to: JSON!
    fromType: String!
    toType: String!
    states: [String]
    category: String!
  }
`

module.exports = createConnectionTypeDefs
