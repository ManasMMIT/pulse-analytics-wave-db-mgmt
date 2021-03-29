import { gql } from 'apollo-server-express'

const updateMarketBasketTypeDefs = gql`
  input UpdateMarketBasketInput {
    id: ID!
    name: String!
    indication: ID!
    description: String
  }
`

export default updateMarketBasketTypeDefs
