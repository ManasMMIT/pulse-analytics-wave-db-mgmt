import { gql } from 'apollo-server-express'

const createMarketBasketCategoryTypeDefs = gql`
  input CreateMarketBasketCategoryInput {
    market_basket: ID!
    name: String!
    category_type: String!
    prompt: String
  }
`

export default createMarketBasketCategoryTypeDefs
