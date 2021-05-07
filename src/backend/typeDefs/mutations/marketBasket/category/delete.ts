import { gql } from 'apollo-server-express'

const deleteMarketBasketCategoryTypeDefs = gql`
  input DeleteMarketBasketCategoryInput {
    id: ID!
  }
`

export default deleteMarketBasketCategoryTypeDefs
