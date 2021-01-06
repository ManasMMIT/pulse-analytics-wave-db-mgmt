import { gql } from 'apollo-server-express'

const createLbmOrganizationTypeDefs = gql`
  input CreateLbmOrganizationInput {
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
    oncologyBenefitManager: String
    parentCompany: String
  }
`

export default createLbmOrganizationTypeDefs
