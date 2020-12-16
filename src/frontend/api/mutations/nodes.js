import gql from 'graphql-tag'

export const UPDATE_NODE = gql`
  mutation UpdateNode($input: UpdateNodeInput!) {
    updateNode(input: $input) {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
      icon
    }
  }
`

export const CREATE_NODE = gql`
  mutation CreateNode($input: CreateNodeInput!) {
    createNode(input: $input) {
      _id
      name
      type
      componentPath
      text
      subtitle
      caption
      order
      parentId
      icon
    }
  }
`
