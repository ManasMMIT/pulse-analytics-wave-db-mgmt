const { gql } = require('apollo-server-express')

const deleteTestEmailGroup = gql`
  input DeleteTestEmailGroupInput {
    _id: ID!
  }
`

module.exports = deleteTestEmailGroup
