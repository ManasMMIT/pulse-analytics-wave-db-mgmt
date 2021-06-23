import { gql } from 'apollo-server-express'

const updateVegaProductTypeDefs = gql`
  input UpdateVegaProductInput {
    id: ID!
    logo_link: String
    color: String
    messaging: String
  }
`

export default updateVegaProductTypeDefs
