const { gql } = require('apollo-server-express')

const createPayerProject = gql`
  input CreatePayerProjectInput {
    name: String!
  }

  type CreatePayerProjectPayload {
    _id: ID!
    name: String
    orgTpIds: [ID]
    extraOrgTpIds: [ID]
  }
`

module.exports = createPayerProject
