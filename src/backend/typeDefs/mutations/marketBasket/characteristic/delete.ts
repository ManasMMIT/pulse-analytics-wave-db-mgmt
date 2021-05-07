import { gql } from 'apollo-server-express'

const deleteMarketBasketCategoryCharacteristicTypeDefs = gql`
  input DeleteMarketBasketCategoryCharacteristicInput {
    id: ID!
  }
`

export default deleteMarketBasketCategoryCharacteristicTypeDefs
