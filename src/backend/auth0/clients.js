class ClientDao {
  constructor(authClient) {
    this.authClient = authClient
  }

  async find(id) {
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
  }

  async create({ name, description }) {
    const client = await this.authClient.createGroup(name, description)
    return client
  }

  async update({ id, name, description }) {
    const updatedClient = await this.authClient.updateGroup({ groupId: id, name, description })
    return updatedClient
  }

  async delete(id) {
    const deletedClient = await this.authClient.removeGroup(id)
    return deletedClient
  }
}

module.exports = ClientDao
