const _ = require('lodash')

class UserDao {
  constructor(authClient) {
    this.authClient = authClient
  }

  async find(id) {
    try {
      let result

      if (id) {
        result = await this.authClient.getUser(id)
      } else {
        result = await this.authClient.getUsers()
      }

      return result
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async create({ username, email, password }) {
    try {
      const createdUser = await this.authClient.createUser(username, email, password)
      return createdUser
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async update({ id, username, email, password }) {
    try {
      const updatedUser = await this.authClient.updateUser(id, { username, email, password })
      return updatedUser
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async delete(id) {
    try {
      const userToDelete = await this.find(id)
      await this.authClient.deleteUser(id)

      return userToDelete
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

module.exports = UserDao
