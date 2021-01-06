const { gql } = require('apollo-server-express')

const deleteObmServiceTypeDefs = gql`
  input DeleteObmServiceInput {
    _id: ID!
  }

  type DeleteObmServicePayload {
    _id: ID
    name: String
  }
`

module.exports = deleteObmServiceTypeDefs
