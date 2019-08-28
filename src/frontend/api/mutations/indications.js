import gql from 'graphql-tag'

export const CREATE_INDICATION = gql`
  mutation CreateIndication($input: CreateIndicationInput!) {
    createIndication(input: $input) {
      _id
      name
    }
  }
`
