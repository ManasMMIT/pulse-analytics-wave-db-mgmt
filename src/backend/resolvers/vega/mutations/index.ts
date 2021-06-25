import vegaCommunityPracticeNetworkResolvers from './communityPracticeNetwork'
import vegaInstitutionResolvers from './institution'
import vegaPersonResolvers from './person'
import vegaPersonRoleResolvers from './personRole'
import vegaPersonRoleTypeResolvers from './personRoleType'
import vegaProductResolvers from './product'
import vegaProviderResolvers from './provider'

export default {
  ...vegaCommunityPracticeNetworkResolvers,
  ...vegaInstitutionResolvers,
  ...vegaPersonResolvers,
  ...vegaPersonRoleResolvers,
  ...vegaPersonRoleTypeResolvers,
  ...vegaProductResolvers,
  ...vegaProviderResolvers,
}
