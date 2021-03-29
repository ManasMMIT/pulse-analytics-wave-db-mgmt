import { gql } from 'apollo-server-express'

const deleteMarketBasketTypeDefs = gql`
  input DeleteMarketBasketInput {
    id: ID!
  }
`

export default deleteMarketBasketTypeDefs
