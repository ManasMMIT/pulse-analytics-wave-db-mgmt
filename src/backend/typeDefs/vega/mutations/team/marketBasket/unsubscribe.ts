import { gql } from 'apollo-server-express'

const unsubscribeTeamToMarketBasketTypeDefs = gql`
  input UnsubscribeTeamToMarketBasketInput {
    id: ID!
  }
`

export default unsubscribeTeamToMarketBasketTypeDefs
