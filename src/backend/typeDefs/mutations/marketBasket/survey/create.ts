import { gql } from 'apollo-server-express'

const createMarketBasketSurveyTypeDefs = gql`
  input CreateMarketBasketSurveyInput {
    market_basket: ID!
    date: DateTime!
  }
`

export default createMarketBasketSurveyTypeDefs
