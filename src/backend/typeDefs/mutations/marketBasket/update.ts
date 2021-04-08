import { gql } from 'apollo-server-express'

const updateMarketBasketTypeDefs = gql`
  input UpdateMarketBasketInput {
    id: ID!
    name: String
    indication: ID
    description: String
    products_regimens: [ID!]
  }
`

export default updateMarketBasketTypeDefs
