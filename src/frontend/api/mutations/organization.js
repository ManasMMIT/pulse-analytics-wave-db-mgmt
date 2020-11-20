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
  mutation CreateProviderOrganization(
    $input: CreateProviderOrganizationInput!
  ) {
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
  mutation DeleteProviderOrganization(
    $input: DeleteProviderOrganizationInput!
  ) {
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
  mutation UpdateProviderOrganization(
    $input: UpdateProviderOrganizationInput!
  ) {
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
  mutation CreatePathwaysOrganization(
    $input: CreatePathwaysOrganizationInput!
  ) {
    createPathwaysOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const DELETE_PATHWAYS_ORGANIZATION = gql`
  mutation DeletePathwaysOrganization(
    $input: DeletePathwaysOrganizationInput!
  ) {
    deletePathwaysOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
    }
  }
`

export const UPDATE_PATHWAYS_ORGANIZATION = gql`
  mutation UpdatePathwaysOrganization(
    $input: UpdatePathwaysOrganizationInput!
  ) {
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

export const DELETE_OBM_SERVICE_CATEGORY = gql`
  mutation DeleteObmServiceCategory($input: DeleteObmServiceCategoryInput!) {
    deleteObmServiceCategory(input: $input) {
      _id
      name
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

export const DELETE_OBM_SERVICE = gql`
  mutation DeleteObmService($input: DeleteObmServiceInput!) {
    deleteObmService(input: $input) {
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
      description
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

export const UPDATE_OBM_TYPE = gql`
  mutation UpdateObmType($input: UpdateObmTypeInput!) {
    updateObmType(input: $input) {
      _id
      name
      description
    }
  }
`

export const CREATE_OBM_TYPE = gql`
  mutation CreateObmType($input: CreateObmTypeInput!) {
    createObmType(input: $input) {
      _id
      name
      description
    }
  }
`

export const DELETE_OBM_TYPE = gql`
  mutation DeleteObmType($input: DeleteObmTypeInput!) {
    deleteObmType(input: $input) {
      _id
      name
      description
    }
  }
`

export const CREATE_OBM_SERVICE = gql`
  mutation CreateObmService($input: CreateObmServiceInput!) {
    createObmService(input: $input) {
      _id
      name
      description
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
      approvalTime
      hasDecisionSupport
      hasPbMbAuthorization
      isEmrIntegrable
      medicalReview
      treatmentSelection
      payer
      pharmacyBenefitManager
      specialtyPharmacy
      labBenefitManager
      parentCompany
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
      approvalTime
      hasDecisionSupport
      hasPbMbAuthorization
      isEmrIntegrable
      medicalReview
      treatmentSelection
      payer
      pharmacyBenefitManager
      specialtyPharmacy
      labBenefitManager
      parentCompany
    }
  }
`

export const DELETE_OBM_ORGANIZATION = gql`
  mutation DeleteObmOrganization($input: DeleteObmOrganizationInput!) {
    deleteObmOrganization(input: $input) {
      _id
      slug
      organization
      organizationTiny
      start
      businessModel
      approvalTime
      hasDecisionSupport
      hasPbMbAuthorization
      isEmrIntegrable
      medicalReview
      treatmentSelection
      payer
      pharmacyBenefitManager
      specialtyPharmacy
      labBenefitManager
      parentCompany
    }
  }
`

export const CONNECT_OBM_SERVICE_AND_OBM_SERVICE_CATEGORY = gql`
  mutation ConnectObmServiceAndObmServiceCategory(
    $input: ConnectObmServiceAndObmServiceCategoryInput!
  ) {
    connectObmServiceAndObmServiceCategory(input: $input) {
      _id
      obmServiceId
      obmServiceCategoryId
    }
  }
`

export const CONNECT_OBM_AND_OBM_SERVICE = gql`
  mutation ConnectObmAndObmService($input: [ConnectObmAndObmServiceInput!]!) {
    connectObmAndObmService(input: $input) {
      _id
      obmId
      obmServiceId
      rating
    }
  }
`

export const CONNECT_OBM_AND_OBM_TYPE = gql`
  mutation ConnectObmAndObmType($input: ConnectObmAndObmTypeInput!) {
    connectObmAndObmType(input: $input) {
      _id
      obmId
      obmTypeId
    }
  }
`

export const CONNECT_OBM_AND_PERSON = gql`
  mutation ConnectObmAndPerson($input: [ConnectObmAndPersonInput!]!) {
    connectObmAndPerson(input: $input) {
      _id
      obmId
      personId
      position
      managementTypes
    }
  }
`

export const CONNECT_OBM_AND_PAYER = gql`
  mutation ConnectObmAndPayer($input: ConnectObmAndPayerInput!) {
    connectObmAndPayer(input: $input) {
      _id
      obmId
      payerId
      bookIds
      note
    }
  }
`

export const CONNECT_OBM_AND_KEY_EVENT = gql`
  mutation ConnectObmAndKeyEvent($input: ConnectObmAndKeyEventInput!) {
    connectObmAndKeyEvent(input: $input) {
      _id
      obmId
      date
      title
      description
      link
      internalTdgNote
    }
  }
`
