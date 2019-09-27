import gql from 'graphql-tag'

export const BULK_CREATE_TREATMENT_PLAN = gql`
  mutation BulkCreateTreatmentPlan($input: BulkCreateTreatmentPlansInput!) {
    bulkCreateTreatmentPlans(input: $input)
  }
`
