import gql from 'graphql-tag'

export const CREATE_INDICATION = gql`
  mutation CreateIndication($input: CreateIndicationInput!) {
    createIndication(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_SOURCE_INDICATION = gql`
  mutation UpdateSourceIndication($input: UpdateSourceIndicationInput!) {
    updateSourceIndication(input: $input) {
      _id
      name
    }
  }
`

export const DELETE_SOURCE_INDICATION = gql`
  mutation DeleteSourceIndication($input: DeleteSourceIndicationInput!) {
    deleteSourceIndication(input: $input) {
      _id
      name
    }
  }
`

export const SELECT_INDICATION = gql`
  mutation SelectIndication($_id: String) {
    selectIndication(_id: $_id) @client {
      _id
      name
      regimens {
        _id
        name
        products {
          _id
          nameGeneric
          nameBrand
          tags
        }
      }
    }
  }
`
