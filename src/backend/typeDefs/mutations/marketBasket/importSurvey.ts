import { gql } from 'apollo-server-express'

// TODO: Replace data: JSON with something real

const importMarketBasketSurveyTypeDefs = gql`
  input ImportMarketBasketSurveyInput {
    marketBasketId: ID!
    surveyId: ID!
    data: JSON
  }
`

export default importMarketBasketSurveyTypeDefs
