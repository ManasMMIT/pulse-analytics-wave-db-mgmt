const { gql } = require('apollo-server-express')

const deleteSourceTreatmentPlanTypeDefs = gql`
  input DeleteSourceTreatmentPlanInput {
    _id: ID!
  }

  type DeleteSourceTreatmentPlanPayload {
    _id: ID
    name: String
  }
`

module.exports = deleteSourceTreatmentPlanTypeDefs
