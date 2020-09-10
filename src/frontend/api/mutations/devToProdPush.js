import gql from 'graphql-tag'

export const CREATE_DEV_TO_PROD_PUSH_CONFIG = gql`
  mutation CreateDevToProdPushConfig {
    createDevToProdPushConfig {
      _id
      name
      collections
    }
  }
`

export const UPDATE_DEV_TO_PROD_PUSH_CONFIG = gql`
  mutation UpdateDevToProdPushConfig($input: UpdateDevToProdPushConfigInput!) {
    updateDevToProdPushConfig(input: $input) {
      _id
      name
      collections
    }
  }
`

export const DELETE_DEV_TO_PROD_PUSH_CONFIG = gql`
  mutation DeleteDevToProdPushConfig($input: DeleteDevToProdPushConfigInput!) {
    deleteDevToProdPushConfig(input: $input) {
      _id
      name
      collections
    }
  }
`

export const PUSH_DEV_TO_PROD = gql`
  mutation PushDevToProd($input: PushDevToProdInput!) {
    pushDevToProd(input: $input)
  }
`
