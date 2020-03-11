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
    const userToDelete = await this.find(id)
    
    await this.authClient.deleteUser(id)

    return userToDelete
  }
}

module.exports = UserDao
