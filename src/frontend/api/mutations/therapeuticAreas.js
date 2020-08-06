import gql from 'graphql-tag'

export const CREATE_THERAPEUTIC_AREA = gql`
  mutation CreateTherapeuticArea($input: CreateTherapeuticAreaInput!) {
    createTherapeuticArea(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_THERAPEUTIC_AREA = gql`
  mutation UpdateTherapeuticArea($input: UpdateTherapeuticAreaInput!) {
    updateTherapeuticArea(input: $input) {
      _id
      name
    }
  }
`

export const DELETE_THERAPEUTIC_AREA = gql`
  mutation DeleteTherapeuticArea($input: DeleteTherapeuticAreaInput!) {
    deleteTherapeuticArea(input: $input) {
      _id
      name
    }
  }
`
