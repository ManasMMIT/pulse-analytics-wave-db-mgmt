import gql from 'graphql-tag'

export const CREATE_REGIMEN = gql`
  mutation CreateRegimen($input: CreateRegimenInput!) {
    createRegimen(input: $input) {
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
`

export const UPDATE_SOURCE_REGIMEN = gql`
  mutation UpdateSourceRegimen($input: UpdateSourceRegimenInput!) {
    updateSourceRegimen(input: $input) {
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
`

export const DELETE_SOURCE_REGIMEN = gql`
  mutation DeleteSourceRegimen($input: DeleteSourceRegimenInput!) {
    deleteSourceRegimen(input: $input) {
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
`
