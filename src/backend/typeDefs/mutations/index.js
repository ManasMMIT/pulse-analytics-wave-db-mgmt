const { gql } = require('apollo-server-express')

const client = require('./client')
const teams = require('./teams')
const user = require('./user')
const sitemap = require('./sitemap')
const indication = require('./indication')
const product = require('./product')
const regimen = require('./regimen')
const qualityAccessScore = require('./qualityAccessScore')

const mutationType = gql`
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload
    updateUser(input: UpdateUserInput!): UpdateUserPayload
    deleteUser(input: DeleteUserInput!): DeleteUserPayload
    createClient(input: CreateClientInput!): CreateClientPayload
    createTeam(input: CreateTeamInput!): CreateTeamPayload
    updateTeam(input: UpdateTeamInput!): UpdateTeamPayload
    deleteTeam(input: DeleteTeamInput!): DeleteTeamPayload
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
    createQualityAccessScore(input: CreateQualityAccessScoreInput!): CreateQualityAccessScorePayload
  }
`

module.exports = [
  mutationType,
  ...client,
  ...teams,
  ...user,
  ...sitemap,
  ...indication,
  ...product,
  ...regimen,
  ...qualityAccessScore,
]
