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
