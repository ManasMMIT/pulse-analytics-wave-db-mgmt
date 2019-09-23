import gql from 'graphql-tag'

export const UPLOAD_COLLECTION = gql`
  mutation UploadCollection($input: UploadCollectionInput!) {
    uploadCollection(input: $input)
  }
`
