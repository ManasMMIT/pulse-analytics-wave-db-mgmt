const { gql } = require('apollo-server-express')

const updateSitemapTypeDefs = gql`
  input UpdateRoleSitemapInput {
    teamId: String!
    updatedSitemap: UpdatedSitemapInput!
  }

  input UpdatedSitemapInput {
    tools: [NodeInput]
    dashboards: [NodeInput]
    pages: [NodeInput]
    cards: [NodeInput]
  }

  type UpdateRoleSitemapPayload {
    tools: [Node]
    dashboards: [Node]
    pages: [Node]
    cards: [Node]
  }
`

module.exports = updateSitemapTypeDefs
