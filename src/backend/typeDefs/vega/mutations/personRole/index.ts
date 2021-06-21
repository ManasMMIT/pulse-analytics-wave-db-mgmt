import createVegaPersonRoleTypeDefs from './create'
import updateVegaPersonRoleTypeDefs from './update'
import deleteVegaPersonRoleTypeDefs from './delete'
import vegaPersonRoleIndicationTypeDefs from './indication'

export default [
  createVegaPersonRoleTypeDefs,
  updateVegaPersonRoleTypeDefs,
  deleteVegaPersonRoleTypeDefs,
  ...vegaPersonRoleIndicationTypeDefs,
]
