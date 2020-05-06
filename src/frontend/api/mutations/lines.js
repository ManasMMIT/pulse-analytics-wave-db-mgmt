import gql from 'graphql-tag'

export const CREATE_LINE = gql`
  mutation CreateLine($input: CreateLineInput!) {
    createLine(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_LINE = gql`
  mutation UpdateLine($input: UpdateLineInput!) {
    updateLine(input: $input) {
      _id
      name
    }
  }
`

export const DELETE_LINE = gql`
  mutation DeleteLine($input: DeleteLineInput!) {
    deleteLine(input: $input) {
      _id
      name
    }
  }
`
