import vegaCommunityPracticeNetworkResolvers from './communityPracticeNetwork'
import vegaInstitutionResolvers from './institution'
import vegaPersonResolvers from './person'
import vegaPersonRoleResolvers from './personRole'
import vegaPersonRoleTypeResolvers from './personRoleType'
import vegaProviderResolvers from './provider'

export default {
  ...vegaCommunityPracticeNetworkResolvers,
  ...vegaInstitutionResolvers,
  ...vegaPersonResolvers,
  ...vegaPersonRoleResolvers,
  ...vegaPersonRoleTypeResolvers,
  ...vegaProviderResolvers,
}
