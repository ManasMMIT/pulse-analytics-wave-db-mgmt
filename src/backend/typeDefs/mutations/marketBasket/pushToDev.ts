import { gql } from 'apollo-server-express'

const pushMarketBasketsToDevTypeDefs = gql`
  input PushMarketBasketsToDevInput {
    marketBasketId: ID!
  }
`

export default pushMarketBasketsToDevTypeDefs
