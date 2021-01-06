const { gql } = require('apollo-server-express')

const updateObmOrganizationTypeDefs = gql`
  input UpdateObmOrganizationInput {
    _id: ID!
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int

    # "technology" fields
    approvalTime: String
    hasDecisionSupport: Boolean
    hasPbMbAuthorization: Boolean
    isEmrIntegrable: Boolean
    medicalReview: String
    treatmentSelection: String

    # "vertical integration" fields that in the future should likely
    # be handled by org-to-org connections
    payer: String
    pharmacyBenefitManager: String
    specialtyPharmacy: String
    labBenefitManager: String
    parentCompany: String
  }

  type UpdateObmOrganizationPayload {
    _id: ID!
    slug: String!
    organization: String
    organizationTiny: String
    businessModel: String
    start: Int

    # "technology" fields
    approvalTime: String
    hasDecisionSupport: Boolean
    hasPbMbAuthorization: Boolean
    isEmrIntegrable: Boolean
    medicalReview: String
    treatmentSelection: String

    # "vertical integration" fields that in the future should likely
    # be handled by org-to-org connections
    payer: String
    pharmacyBenefitManager: String
    specialtyPharmacy: String
    labBenefitManager: String
    parentCompany: String
  }
`

module.exports = updateObmOrganizationTypeDefs
