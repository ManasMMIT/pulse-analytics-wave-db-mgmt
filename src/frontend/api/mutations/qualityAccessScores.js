import gql from 'graphql-tag'

export const CREATE_QUALITY_ACCESS_SCORE = gql`
  mutation CreateQualityAccessScore($input: CreateQualityAccessScoreInput!) {
    createQualityAccessScore(input: $input) {
      _id
      access
      accessTiny
      score
      sortOrder
      color
      relevance
      caption
    }
  }
`
