import { gql } from 'apollo-server-express'

const deleteLbmServiceTypeDefs = gql`
  input DeleteLbmServiceInput {
    _id: ID!
  }

  type DeleteLbmServicePayload {
    _id: ID
    name: String
  }
`

export default deleteLbmServiceTypeDefs
