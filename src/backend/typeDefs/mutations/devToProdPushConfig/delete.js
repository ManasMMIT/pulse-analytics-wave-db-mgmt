const { gql } = require('apollo-server-express')

const deleteDevToProdPushConfig = gql`
  input DeleteDevToProdPushConfigInput {
    _id: ID!
  }
`

module.exports = deleteDevToProdPushConfig
