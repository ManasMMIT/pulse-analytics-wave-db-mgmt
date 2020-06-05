import gql from 'graphql-tag'

export const UPSERT_ORGANIZATION_META = gql`
  mutation UpsertOrganizationMeta($input: UpsertOrganizationMetaInput!) {
    upsertOrganizationMeta(input: $input) {
      _id
      accountId
      exportedAt
      exporter
      updatedAt
      updater
    }
  }
`

export const BULK_IMPORT_PROVIDER_ORGANIZATIONS = gql`
  mutation BulkImportProviderOrganizations($data: JSON) {
    bulkImportProviderOrganizations(data: $data)
  }
`

export const CREATE_PROVIDER_ORGANIZATION = gql`
  mutation CreateProviderOrganization($input: CreateProviderOrganizationInput!) {
    createProviderOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      providerCancerCenter
      state
      city
      oncologistsCount
      groupPracticePacId
    }
  }
`

export const DELETE_PROVIDER_ORGANIZATION = gql`
  mutation DeleteProviderOrganization($input: DeleteProviderOrganizationInput!) {
    deleteProviderOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      providerCancerCenter
      state
      city
      oncologistsCount
    }
  }
`

export const UPDATE_PROVIDER_ORGANIZATION = gql`
  mutation UpdateProviderOrganization($input: UpdateProviderOrganizationInput!) {
    updateProviderOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      providerCancerCenter
      state
      city
      oncologistsCount
      connections
      groupPracticePacId
    }
  }
`

export const CREATE_PAYER_ORGANIZATION = gql`
  mutation CreatePayerOrganization($input: CreatePayerOrganizationInput!) {
    createPayerOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const DELETE_PAYER_ORGANIZATION = gql`
  mutation DeletePayerOrganization($input: DeletePayerOrganizationInput!) {
    deletePayerOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_PAYER_ORGANIZATION = gql`
  mutation UpdatePayerOrganization($input: UpdatePayerOrganizationInput!) {
    updatePayerOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      connections
    }
  }
`

export const CREATE_PATHWAYS_ORGANIZATION = gql`
  mutation CreatePathwaysOrganization($input: CreatePathwaysOrganizationInput!) {
    createPathwaysOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const DELETE_PATHWAYS_ORGANIZATION = gql`
  mutation DeletePathwaysOrganization($input: DeletePathwaysOrganizationInput!) {
    deletePathwaysOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_PATHWAYS_ORGANIZATION = gql`
  mutation UpdatePathwaysOrganization($input: UpdatePathwaysOrganizationInput!) {
    updatePathwaysOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      connections
    }
  }
`

export const CREATE_APM_ORGANIZATION = gql`
  mutation CreateApmOrganization($input: CreateApmOrganizationInput!) {
    createApmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const DELETE_APM_ORGANIZATION = gql`
  mutation DeleteApmOrganization($input: DeleteApmOrganizationInput!) {
    deleteApmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_APM_ORGANIZATION = gql`
  mutation UpdateApmOrganization($input: UpdateApmOrganizationInput!) {
    updateApmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      connections
    }
  }
`

export const UPDATE_OBM_SERVICE_CATEGORY = gql`
  mutation UpdateObmServiceCategory($input: UpdateObmServiceCategoryInput!) {
    updateObmServiceCategory(input: $input) {
      _id
      name
    }
  }
`

export const UPDATE_OBM_SERVICE = gql`
  mutation UpdateObmService($input: UpdateObmServiceInput!) {
    updateObmService(input: $input) {
      _id
      name
    }
  }
`

export const CREATE_OBM_SERVICE_CATEGORY = gql`
  mutation CreateObmServiceCategory($input: CreateObmServiceCategoryInput!) {
    createObmServiceCategory(input: $input) {
      _id
      name
    }
  }
`

export const CREATE_OBM_SERVICE = gql`
  mutation CreateObmService($input: CreateObmServiceInput!) {
    createObmService(input: $input) {
      _id
      name
    }
  }
`

export const CREATE_OBM_ORGANIZATION = gql`
  mutation CreateObmOrganization($input: CreateObmOrganizationInput!) {
    createObmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      start
      businessModel
    }
  }
`

export const UPDATE_OBM_ORGANIZATION = gql`
  mutation UpdateObmOrganization($input: UpdateObmOrganizationInput!) {
    updateObmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      start
      businessModel
    }
  }
`
