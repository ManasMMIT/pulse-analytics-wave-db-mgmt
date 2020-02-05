const { gql } = require('apollo-server-express')

const updatePermissionsTypeDefs = gql`
  input UpdatePermissionsInput {
    nodeId: String!
    teamId: String!
    updatedResources: JSON!
  }
`

module.exports = updatePermissionsTypeDefs
