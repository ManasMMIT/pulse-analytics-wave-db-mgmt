const { gql } = require('apollo-server-express')

const bulkCreateTreatmentPlanTypeDefs = gql`
  input BulkCreateTreatmentPlansInput {
    data: JSON!
  }
`

module.exports = bulkCreateTreatmentPlanTypeDefs
