import createVegaPersonRole from './create'
import updateVegaPersonRole from './update'
import deleteVegaPersonRole from './delete'
import vegaPersonRoleIndicationResolvers from './indication'

export default {
  createVegaPersonRole,
  updateVegaPersonRole,
  deleteVegaPersonRole,
  ...vegaPersonRoleIndicationResolvers,
}
