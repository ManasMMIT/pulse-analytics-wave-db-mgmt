import { gql } from 'apollo-server-express'

const updateMarketBasketCategoryCharacteristicTypeDefs = gql`
  input UpdateMarketBasketCategoryCharacteristicInput {
    id: ID!
    category: String
    name: String!
    description: String
  }
`

export default updateMarketBasketCategoryCharacteristicTypeDefs
