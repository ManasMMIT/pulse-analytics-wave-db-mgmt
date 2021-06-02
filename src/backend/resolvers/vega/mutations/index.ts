import vegaPersonResolvers from './person'
import vegaPersonRoleResolvers from './personRole'
import vegaPersonRoleTypeResolvers from './personRoleType'

export default {
  ...vegaPersonResolvers,
  ...vegaPersonRoleResolvers,
  ...vegaPersonRoleTypeResolvers,
}
