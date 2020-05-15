const { gql } = require('apollo-server-express')

const updateTdgTimestamps = gql`
  input UpdateTdgTimestampsInput {
    _id: ID!
    tdgTimestamp: String!
  }
`

module.exports = updateTdgTimestamps
