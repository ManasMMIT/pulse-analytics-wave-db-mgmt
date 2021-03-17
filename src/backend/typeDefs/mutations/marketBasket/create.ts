import { gql } from 'apollo-server-express'

const createMarketBasketTypeDefs = gql`
  input CreateMarketBasketInput {
    name: String!
    indication: ID!
  }
`

export default createMarketBasketTypeDefs
