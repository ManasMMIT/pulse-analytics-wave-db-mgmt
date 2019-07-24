const _ = require('lodash')

class RoleDao {
  constructor(authClient) {
    this.authClient = authClient
  }

  async find(id) {
    try {
      // In auth0, groups include both a top-level group that corresponds to a
      // TDG 'client' as well as nested groups corresponding to TDG clients' 'teams'.
      // Those nested groups each in turn have a role in Auth0 with the same name.
      const groups = await this.authClient.getGroups()

      // groups without nested groups correspond to roles
      const roles = groups.filter(({ nested }) => !nested || !nested.length)

      // if id is passed in, get only the role matching the id
      if (id) return roles.find(({ _id }) => id === _id)

      return roles
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async create({ clientId, name, description }) {
    try {
      // status quo admin hub pattern requires us to create
      // an auth0 group and auth0 role of the same name and description
      const group = await this.authClient.createGroup(name, description)
      const role = await this.authClient.createRole(name, description)

      // next we need to associate the group to the client
      // and associate the role to the group
      await Promise.all([
        this.authClient.addNestedGroup(clientId, group._id),
        this.authClient.addGroupRole(group._id, role._id),
      ])

      // arbitrarily returning the auth0 group rather than the auth0 role
      // (status quo psql roles get their ids from corresponding groups in auth0)
      return group
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async update({ id, description }) {
    try {
      const groupToUpdate = await this.find(id)

      // TODO: Don't depend on the hyphen to get clientName
      const [clientName] = groupToUpdate.name.split('-')

      const [roleIdToUpdate] = groupToUpdate.roles
      const roleToUpdate = await this.authClient.getRole(roleIdToUpdate)
      const rolePermissions = _.isEmpty(roleToUpdate.permissions) ? [] : roleToUpdate.permissions

      const newName = `${clientName}-${description}`

      const nameAndDescrip = { name: newName, description }

      const updatedGroup = await this.authClient.updateGroup({
        groupId: id,
        ...nameAndDescrip,
      })

      await this.authClient.updateRole({
        id: roleIdToUpdate,
        ...nameAndDescrip,
        permissions: rolePermissions,
      })

      return updatedGroup
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async delete({ id, clientId }) {
    try {
      const groupToDelete = await this.find(id)
      const [roleIdToDelete] = groupToDelete.roles

      // ! Steps must be done in this order
      /*
        1. Delete nested group association
        2. Delete group
        3. Delete free-floating role
      */
      await this.authClient.removeNestedGroup(clientId, id)
      await this.authClient.removeGroup(id)
      
      await this.authClient.removeRole(roleIdToDelete)
      return groupToDelete
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

module.exports = RoleDao
