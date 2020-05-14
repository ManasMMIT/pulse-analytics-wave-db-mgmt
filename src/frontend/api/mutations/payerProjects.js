import gql from 'graphql-tag'

export const CREATE_PAYER_PROJECT = gql`
  mutation CreatePayerProject($input: CreatePayerProjectInput!) {
    createPayerProject(input: $input) {
      _id
      name
      orgTpIds
      extraOrgTpIds
    }
  }
`

export const UPDATE_PAYER_PROJECT_PTPS = gql`
  mutation UpdatePayerProjectPtps($input: UpdatePayerProjectPtpsInput!) {
    updatePayerProjectPtps(input: $input)
  }
`

export const REMOVE_PAYER_PROJECT_PTPS = gql`
  mutation RemovePayerProjectPtps($input: RemovePayerProjectPtpsInput!) {
    removePayerProjectPtps(input: $input)
  }
`

export const TRANSFER_PAYER_PROJECT_PTPS = gql`
  mutation TransferPayerProjectPtps($input: TransferPayerProjectPtpsInput!) {
    transferPayerProjectPtps(input: $input)
  }
`
