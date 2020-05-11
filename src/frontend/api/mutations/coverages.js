import gql from 'graphql-tag'

export const CREATE_COVERAGE = gql`
  mutation CreateCoverage($input: CreateCoverageInput!) {
    createCoverage(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_COVERAGE = gql`
  mutation UpdateCoverage($input: UpdateCoverageInput!) {
    updateCoverage(input: $input) {
      _id
      name
    }
  }
`

export const DELETE_COVERAGE = gql`
  mutation DeleteCoverage($input: DeleteCoverageInput!) {
    deleteCoverage(input: $input) {
      _id
      name
    }
  }
`
