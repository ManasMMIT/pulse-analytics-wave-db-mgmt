import { gql } from 'apollo-server-express'

const updateMarketBasketSurveyTypeDefs = gql`
  input UpdateMarketBasketSurveyInput {
    id: ID!
    stakeholders: [ID!]
    date: DateTime
  }
`

export default updateMarketBasketSurveyTypeDefs
