import gql from 'graphql-tag'

export const CREATE_BUSINESS_OBJECT = gql`
  mutation CreateBusinessObject($input: CreateBusinessObjectInput!) {
    createBusinessObject(input: $input) {
      _id
      name
      sourceCollection {
        collection
      }
      fields {
        _id
        key
        type
      }
    }
  }
`

export const CREATE_BUSINESS_OBJECT_FIELD = gql`
  mutation CreateBusinessObjectField($input: CreateBusinessObjectFieldInput!) {
    createBusinessObjectField(input: $input) {
      _id
      key
      type
    }
  }
`

export const DELETE_BUSINESS_OBJECT = gql`
  mutation DeleteBusinessObject($input: DeleteBusinessObjectInput!) {
    deleteBusinessObject(input: $input) {
      _id
      name
      sourceCollection {
        collection
      }
      fields {
        _id
        key
        type
      }
    }
  }
`

export const DELETE_BUSINESS_OBJECT_FIELD = gql`
  mutation DeleteBusinessObjectField($input: DeleteBusinessObjectFieldInput!) {
    deleteBusinessObjectField(input: $input) {
      _id
      key
      type
    }
  }
`

export const UPDATE_BUSINESS_OBJECT = gql`
  mutation UpdateBusinessObject($input: UpdateBusinessObjectInput!) {
    updateBusinessObject(input: $input) {
      _id
      name
      sourceCollection {
        collection
      }
      fields {
        _id
        key
        type
      }
    }
  }
`

export const UPDATE_BUSINESS_OBJECT_FIELD = gql`
  mutation UpdateBusinessObjectField($input: UpdateBusinessObjectFieldInput!) {
    updateBusinessObjectField(input: $input) {
      _id
      key
      type
    }
  }
`
