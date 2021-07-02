import { gql } from 'apollo-server-express'

const subscribeTeamToMarketBasketTypeDefs = gql`
  input SubscribeTeamToMarketBasketInput {
    team: ID!
    market_basket: ID!
  }
`

export default subscribeTeamToMarketBasketTypeDefs
