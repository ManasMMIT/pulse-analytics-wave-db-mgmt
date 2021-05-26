import { gql } from 'apollo-server-express'

const importMarketBasketSurveyTypeDefs = gql`
  input ImportMarketBasketSurveyInput {
    marketBasketId: ID!
    surveyId: ID!
    data: [MarketBasketSurveyExportInput!]!
  }

  # ! Sould be kept aligned with type MarketBasketSurveyExportDatum
  input MarketBasketSurveyExportInput {
    first_name: String
    middle_name: String
    last_name: String

    category_name: String
    category_type: String
    characteristic_name: String

    regimen_name: String
    product_brand_name: String
    product_generic_name: String
    manufacturer_name: String

    question_id: ID
    answer_id: ID
    rating: Int

    person_id: ID
    category_id: ID
    characteristic_id: ID
    regimen_id: ID
    product_id: ID
    manufacturer_id: ID
  }
`

export default importMarketBasketSurveyTypeDefs
