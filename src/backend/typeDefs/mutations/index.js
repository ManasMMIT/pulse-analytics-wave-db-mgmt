const { gql } = require('apollo-server-express')

const sitemap = require('./sitemap')
const indication = require('./indication')

const mutationType = gql`
  type Mutation {
    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
    pushSitemapToDev: String
    pushSitemapToProd: String
    createIndication(input: CreateIndicationInput!): CreateIndicationPayload
  }
`

module.exports = [
  mutationType,
  ...sitemap,
  ...indication,
]
