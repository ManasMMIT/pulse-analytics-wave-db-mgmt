const { gql } = require('apollo-server-express')

const sitemap = require('./sitemap')
const indication = require('./indication')
const product = require('./product')

const mutationType = gql`
  type Mutation {
    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
    pushSitemapToDev: String
    pushSitemapToProd: String
    createIndication(input: CreateIndicationInput!): CreateIndicationPayload
    updateSourceIndication(input: UpdateSourceIndicationInput!): UpdateSourceIndicationPayload
    deleteSourceIndication(input: DeleteSourceIndicationInput!): DeleteSourceIndicationPayload
    createProduct(input: CreateProductInput!): CreateProductPayload
    updateSourceProduct(input: UpdateSourceProductInput!): UpdateSourceProductPayload
    deleteSourceProduct(input: DeleteSourceProductInput!): DeleteSourceProductPayload
  }
`

module.exports = [
  mutationType,
  ...sitemap,
  ...indication,
  ...product,
]
