import gql from 'graphql-tag'

export const CREATE_COMMUNITY_PRACTICE_NETWORK = gql`
  mutation CreateVegaCommunityPracticeNetwork($input: CreateVegaCommunityPracticeNetworkInput!) {
    createVegaCommunityPracticeNetwork(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const UPDATE_COMMUNITY_PRACTICE_NETWORK = gql`
  mutation UpdateVegaCommunityPracticeNetwork($input: UpdateVegaCommunityPracticeNetworkInput!) {
    updateVegaCommunityPracticeNetwork(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const DELETE_COMMUNITY_PRACTICE_NETWORK = gql`
  mutation DeleteVegaCommunityPracticeNetwork($input: DeleteVegaCommunityPracticeNetworkInput!) {
    deleteVegaCommunityPracticeNetwork(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`
