const wait = require('./../../utils/wait')

class UserDao {
  constructor(authClient) {
    this.authClient = authClient
  }

  async find(id) {
    let result

    if (id) {
      result = await this.authClient.getUser(id)
    } else {
      result = await this.authClient.getUsers()
    }

    return result
  }

  async create({ username, email, password }) {
    const createdUser = await this.authClient.createUser(username, email, password)
    return createdUser
  }

  async update({ id, username, email, password }) {
    const updatedUser = await this.authClient.updateUser(id, { username, email, password })
    return updatedUser
  }

  async delete(id) {
    // remove user from all groups
    const userGroups = await this.authClient.getUserGroups(id)

    for (const group of userGroups) {
      await wait()
      await this.authClient.removeGroupMember(group._id, id)
    }

    // delete actual user
    await wait()
    const userToDelete = await this.find(id)
    await wait()
    await this.authClient.deleteUser(id)

    return userToDelete
  }
}

module.exports = UserDao
