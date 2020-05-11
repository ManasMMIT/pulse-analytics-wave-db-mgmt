import gql from 'graphql-tag'

export const CREATE_POPULATION = gql`
  mutation CreatePopulation($input: CreatePopulationInput!) {
    createPopulation(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_POPULATION = gql`
  mutation UpdatePopulation($input: UpdatePopulationInput!) {
    updatePopulation(input: $input) {
      _id
      name
    }
  }
`

export const DELETE_POPULATION = gql`
  mutation DeletePopulation($input: DeletePopulationInput!) {
    deletePopulation(input: $input) {
      _id
      name
    }
  }
`
