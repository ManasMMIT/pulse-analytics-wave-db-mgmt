import { gql } from 'apollo-server-express'

// TODO: Replace data: JSON with something real

const importMarketBasketSurveyTypeDefs = gql`
  input ImportMarketBasketSurveyDataInput {
    personId: ID!
    categoryId: ID!
    characteristicId: ID!

    person: String
    category: String
    characteristic: String
    stakeholderRole: String
    regimen: String
    product: String
    manufacturer: String
    rating: Int
    regimenId: ID
    productId: ID
    manufacturerId: ID
    questionId: ID
    answerId: ID
  }

  input ImportMarketBasketSurveyInput {
    marketBasketId: ID!
    surveyId: ID!
    data: [ImportMarketBasketSurveyDataInput!]!
  }
`

export default importMarketBasketSurveyTypeDefs
