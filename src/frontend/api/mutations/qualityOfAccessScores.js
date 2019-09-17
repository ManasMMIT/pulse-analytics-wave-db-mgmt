import gql from 'graphql-tag'

export const CREATE_QUALITY_OF_ACCESS_SCORE = gql`
  mutation CreateQualityOfAccessScore($input: CreateQualityOfAccessScoreInput!) {
    createQualityOfAccessScore(input: $input) {
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
export const UPDATE_QUALITY_OF_ACCESS_SCORE = gql`
  mutation UpdateQualityOfAccessScore($input: UpdateQualityOfAccessScoreInput!) {
    UpdateQualityOfAccessScore(input: $input) {
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
