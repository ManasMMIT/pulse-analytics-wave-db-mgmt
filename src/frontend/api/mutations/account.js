import gql from 'graphql-tag'

export const UPDATE_PROVIDER_ACCOUNT = gql`
  mutation UpdateProviderAccount($input: UpdateAccountInput!) {
    updateAccount(type: "provider", input: $input) {
      _id
      type
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_PAYER_ACCOUNT = gql`
  mutation UpdatePayerAccount($input: UpdateAccountInput!) {
    updateAccount(type: "payer", input: $input) {
      _id
      type
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_PATHWAYS_ACCOUNT = gql`
  mutation UpdatePathwaysAccount($input: UpdateAccountInput!) {
    updateAccount(type: "pathways", input: $input) {
      _id
      type
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_APM_ACCOUNT = gql`
  mutation UpdateApmAccount($input: UpdateAccountInput!) {
    updateAccount(type: "apm", input: $input) {
      _id
      type
      slug
      organization
      organizationTiny
    }
  }
`



