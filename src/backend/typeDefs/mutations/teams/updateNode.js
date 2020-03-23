const { gql } = require('apollo-server-express')

const updateTeamNodeTypeDefs = gql`
  input UpdateTeamNodeInput {
    teamId: ID!
    nodeData: JSON!
  }
`

module.exports = updateTeamNodeTypeDefs
