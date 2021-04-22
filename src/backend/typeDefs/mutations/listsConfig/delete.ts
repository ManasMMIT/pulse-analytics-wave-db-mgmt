const { gql } = require('apollo-server-express')

const deleteListsConfigTypeDefs = gql`
  input DeleteListsConfigInput {
    _id: ID!
  }
`

export default deleteListsConfigTypeDefs
