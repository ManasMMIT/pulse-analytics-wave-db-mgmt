import gql from 'graphql-tag'

export const CREATE_SOURCE_TREATMENT_PLAN = gql`
  mutation CreateSourceTreatmentPlan($input: CreateSourceTreatmentPlanInput!) {
    createSourceTreatmentPlan(input: $input) {
      indication
      regimen
      population
      line
      book
      coverage
    }
  }
`

export const UPDATE_SOURCE_TREATMENT_PLAN = gql`
  mutation UpdateSourceTreatmentPlan($input: UpdateSourceTreatmentPlanInput!) {
    updateSourceTreatmentPlan(input: $input)
  }
`

export const DELETE_SOURCE_TREATMENT_PLAN = gql`
  mutation DeleteSourceTreatmentPlan($input: DeleteSourceTreatmentPlanInput!) {
    deleteSourceTreatmentPlan(input: $input)
  }
`

export const BULK_CREATE_TREATMENT_PLAN = gql`
  mutation BulkCreateTreatmentPlan($input: BulkCreateTreatmentPlansInput!) {
    bulkCreateTreatmentPlans(input: $input)
  }
`
