const { gql } = require('apollo-server-express')

const deleteVbmConnectionTypeDefs = gql`
  input DeleteVbmConnectionInput {
    _id: String!
  }
`

module.exports = deleteVbmConnectionTypeDefs
