import gql from 'graphql-tag'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      _id
      nameGeneric
      nameBrand
      tags
    }
  }
`

export const UPDATE_SOURCE_PRODUCT = gql`
  mutation UpdateSourceProduct($input: UpdateSourceProductInput!) {
    updateSourceProduct(input: $input) {
      _id
      nameGeneric
      nameBrand
      tags
    }
  }
`

export const DELETE_SOURCE_PRODUCT = gql`
  mutation DeleteSourceProduct($input: DeleteSourceProductInput!) {
    deleteSourceProduct(input: $input) {
      _id
      nameGeneric
      nameBrand
      tags
    }
  }
`
