import { gql } from 'apollo-server-express'

const deleteLbmTypeTypeDefs = gql`
  input DeleteLbmTypeInput {
    _id: ID!
  }
`

export default deleteLbmTypeTypeDefs
