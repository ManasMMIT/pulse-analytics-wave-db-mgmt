import gql from 'graphql-tag'

export const CREATE_US_STATE = gql`
  mutation CreateUsState($input: CreateUsStateInput!) {
    createUsState(input: $input) {
      _id
      state
      stateLong
      status
      booksImpacted
      law
      lawLink
      bill
      surveyCommercialLivesPercentInsured
    }
  }
`

export const UPDATE_US_STATE = gql`
  mutation UpdateUsState($input: UpdateUsStateInput!) {
    updateUsState(input: $input) {
      _id
      state
      stateLong
      status
      booksImpacted
      law
      lawLink
      bill
      surveyCommercialLivesPercentInsured
    }
  }
`

export const DELETE_US_STATE = gql`
  mutation DeleteUsState($input: DeleteUsStateInput!) {
    deleteUsState(input: $input) {
      _id
      state
      stateLong
      status
      booksImpacted
      law
      lawLink
      bill
      surveyCommercialLivesPercentInsured
    }
  }
`
