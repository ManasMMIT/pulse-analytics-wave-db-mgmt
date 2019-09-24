const { gql } = require('apollo-server-express')

const uploadCollectionTypeDefs = gql`
  input UploadCollectionInput {
    data: JSON!
    collectionName: String
  }
`

module.exports = uploadCollectionTypeDefs
