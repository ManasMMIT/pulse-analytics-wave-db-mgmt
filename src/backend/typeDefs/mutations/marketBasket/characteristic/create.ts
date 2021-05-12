import { gql } from 'apollo-server-express'

const createMarketBasketCategoryCharacteristicTypeDefs = gql`
  input CreateMarketBasketCategoryCharacteristicInput {
    category: String!
    name: String!
    description: String
  }
`

export default createMarketBasketCategoryCharacteristicTypeDefs
