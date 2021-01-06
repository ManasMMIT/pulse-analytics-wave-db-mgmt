import { gql } from 'apollo-server-express'

const deleteLbmAndPayerConnectionTypeDefs = gql`
  input DeleteLbmAndPayerConnectionInput {
    _id: ID!
  }
`

export default deleteLbmAndPayerConnectionTypeDefs
