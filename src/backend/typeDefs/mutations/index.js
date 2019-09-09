const { gql } = require('apollo-server-express')

const sitemap = require('./sitemap')
const indication = require('./indication')
const product = require('./product')
const regimen = require('./regimen')

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
    createRegimen(input: CreateRegimenInput!): CreateRegimenPayload
    updateSourceRegimen(input: UpdateSourceRegimenInput!): UpdateSourceRegimenPayload
    deleteSourceRegimen(input: DeleteSourceRegimenInput!): DeleteSourceRegimenPayload
  }
`

module.exports = [
  mutationType,
  ...sitemap,
  ...indication,
  ...product,
  ...regimen,
]
