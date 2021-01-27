const { gql } = require('apollo-server-express')

const deleteObmServiceTypeDefs = gql`
  input DeleteObmServiceInput {
    id: ID!
  }

  type DeleteObmServicePayload {
    id: ID
  }
`

module.exports = deleteObmServiceTypeDefs
