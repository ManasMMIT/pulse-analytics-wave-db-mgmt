import { gql } from 'apollo-server-express'

const updateMarketBasketCategoryTypeDefs = gql`
  input UpdateMarketBasketCategoryInput {
    id: ID!
    name: String
    category_type: String
    prompt: String
    characteristics: [ID!]
  }
`

export default updateMarketBasketCategoryTypeDefs
