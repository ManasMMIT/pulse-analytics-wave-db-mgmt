class ClientDao {
  constructor(authClient) {
    this.authClient = authClient
  }

  async find(id) {
    try {
      // In auth0, groups include both a top-level group that corresponds to a
      // TDG 'client' as well as nested groups corresponding to TDG clients' 'teams'.
      // Those nested groups each in turn have a role in Auth0 with the same name.
      const groups = await this.authClient
        .getGroups()

      // if the groups have the nested prop, they have children (nested groups);
      // if they have children, then they're considered TDG 'clients'
      const clients = groups.filter(({ nested }) => nested && nested.length)

      // if id is passed in, get only the client matching the id
      if (id) return clients.find(({ _id }) => id === _id)

      return clients
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async create({ name, description }) {
    try {
      const client = await this.authClient.createGroup(name, description)
      return client
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async update({ id, name, description }) {
    try {
      const updatedClient = await this.authClient.updateGroup({ groupId: id, name, description })
      return updatedClient
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async delete(id) {
    try {
      const deletedClient = await this.authClient.removeGroup(id)
      return deletedClient
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

module.exports = ClientDao
