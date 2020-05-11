const { gql } = require('apollo-server-express')

const createSourceTreatmentPlanTypeDefs = gql`
  input CreateSourceTreatmentPlanInput {
    indication: ID!
    regimen: ID!
    line: ID!
    population: ID!
    book: ID!
    coverage: ID!
  }

  type CreateSourceTreatmentPlanPayload {
    indication: ID!
    regimen: ID!
    line: ID!
    population: ID!
    book: ID!
    coverage: ID!
  }
`

module.exports = createSourceTreatmentPlanTypeDefs
