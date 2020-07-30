const { gql } = require('apollo-server-express')

const updateEndUserTermsTypeDefs = gql`
  input UpdateEndUserTermsInput {
    link: String!
  }

  type UpdateEndUserTermsPayload {
    _id: ID
    link: String
  }
`

module.exports = updateEndUserTermsTypeDefs
