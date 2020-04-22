const { gql } = require('apollo-server-express')

const updatePayerProjectPtpsTypeDefs = gql`
  input UpdatePayerProjectPtpsInput {
    projectId: ID!
    organizationIds: [ID!]!
    treatmentPlanIds: [ID!]!
  }
`

module.exports = updatePayerProjectPtpsTypeDefs
