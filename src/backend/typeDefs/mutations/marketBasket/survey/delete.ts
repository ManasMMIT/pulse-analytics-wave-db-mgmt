import { gql } from 'apollo-server-express'

const deleteMarketBasketSurveyTypeDefs = gql`
  input DeleteMarketBasketSurveyInput {
    id: ID!
  }
`

export default deleteMarketBasketSurveyTypeDefs
