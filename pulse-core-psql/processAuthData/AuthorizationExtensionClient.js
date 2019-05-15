const fetch = require('node-fetch')

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

module.exports = class {
  constructor(url, opts) {
    this.url = url
    if (!opts.tokenIssuerConfig && !opts.tokenResolverPromise) {
      throw new Error('Requires either tokenIssuerConfig or tokenResolverPromise')
    }
    if (opts.tokenIssuerConfig) {
      this.tokenIssuerUrl = opts.tokenIssuerConfig.tokenIssuerUrl
      this.clientId = opts.tokenIssuerConfig.clientId
      this.clientSecret = opts.tokenIssuerConfig.clientSecret
    }
    if (opts.tokenResolverPromise) {
      this.tokenResolverPromise = opts.tokenResolverPromise
    }
  }

  isAuthenticated() {
    return this.accessToken && this.expiresAt > new Date().getTime()
  }

  authenticate() {
    if (this.isAuthenticated()) return Promise.resolve()
    if (this.tokenResolverPromise) {
      return this.tokenResolverPromise()
        .then(json => {
          this.accessToken = json.access_token
          this.scope = json.scope
          this.expiresAt = json.expiresAt
        })
    }

    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: 'urn:auth0-authz-api',
      grant_type: 'client_credentials'
    }

    return fetch(`${this.tokenIssuerUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        this.accessToken = json.access_token
        this.scope = json.scope
        this.expiresAt = json.expires_in * 1000 + new Date().getTime()
      })
  }

  addGroupRole(groupId, roleId) {
    return this.addGroupRoles(groupId, [roleId])
  }

  addGroupRoles(groupId, roleIdArray) {
    return this.authenticate().then(() =>
      fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}/roles`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(roleIdArray)
      })
    )
  }

  addGroupMember(groupId, userId) {
    return this.addGroupMembers(groupId, [userId])
  }

  addGroupMembers(groupId, userIdArray) {
    return this.authenticate().then(() =>
      fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}/members`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(userIdArray)
      })
    )
  }

  addNestedGroup(groupId, groupIdToAdd) {
    return this.addNestedGroups(groupId, [groupIdToAdd])
  }

  addNestedGroups(groupId, groupIdsToAddArray) {
    return this.authenticate().then(() =>
      fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}/nested`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(groupIdsToAddArray)
      })
    )
  }

  getAccessTokenInfo() {
    return {
      access_token: this.accessToken,
      expiresAt: this.expiresAt
    }
  }

  getUser(id) {
    return this.authenticate().then(
      () => fetch(`${this.url}/users/${id}`, {
        method: 'GET',
        headers: { authorization: `Bearer ${this.accessToken}` }
      })
    ).then(checkStatus)
      .then(response => response.json())
  }

  getUsers() {
    const paginateUserRequest = async () => {
      let users = []
      let usersFetched = 0
      let hasNext = true
      let pageNum = 1

      // Note: per_page query string doesn't appear to work.
      // Note: user pagination for auth ext is one-based (https://auth0.com/docs/api/authorization-extension?shell#get-all-users)
      const apiURL = page => `${this.url}/users?page=${page}`

      while (hasNext) {
        await new Promise(resolve => {
          fetch(apiURL(pageNum), {
            headers: {
              authorization: `Bearer ${this.accessToken}`
            }
          })
            .then(checkStatus)
            .then(response => response.json())
            .then(response => {
              users = users.concat(response.users)
              usersFetched += response.users.length
              pageNum += 1

              if (response.total - usersFetched === 0) {
                hasNext = false
              }
              resolve()
            })
        })
      }

      return users
    }

    return this.authenticate()
      .then(paginateUserRequest)
  }

  getRoles() {
    return this.authenticate()
      .then(
        () => fetch(`${this.url}/roles`, {
          method: 'GET',
          headers: { authorization: `Bearer ${this.accessToken}` }
        }))
      .then(checkStatus)
      .then(response => response.json())
      .then(json => json.roles)
  }

  getGroups() {
    return this.authenticate()
      .then(
        () => fetch(`${this.url}/groups`, {
          method: 'GET',
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
      )
      .then(checkStatus)
      .then(response => response.json())
      .then(json => json.groups)
  }

  getPermissions() {
    return this.authenticate()
      .then(
        () => fetch(`${this.url}/permissions`, {
          method: 'GET',
          headers: { authorization: `Bearer ${this.accessToken}` }
        }))
      .then(checkStatus)
      .then(response => response.json())
      .then(json => json.permissions)
  }

  getUserGroups(id, expand) {
    return this.authenticate()
      .then(() =>
        fetch(`${this.url}/users/${id}/groups${expand ? '?expand=true' : ''}`, {
          method: 'GET',
          headers: { authorization: `Bearer ${this.accessToken}` }
        })
      ).then(checkStatus)
      .then(response => response.json())
  }

  createGroup(name, description) {
    return this.authenticate()
      .then(() =>
        fetch('https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
          })
        })
      )
      .then(checkStatus)
      .then(response => response.json())
  }

  createPermission(name, description, applicationId) {
    return this.authenticate()
      .then(() =>
        fetch(`${this.url}/permissions`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            applicationId,
            applicationType: 'client'
          })
        }))
      .then(checkStatus)
      .then(response => response.json())
  }

  createRole(name, description, applicationId) {
    return this.authenticate()
      .then(() =>
        fetch(`${this.url}/roles`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            applicationId,
            applicationType: 'client'
          })
        })
      )
      .then(checkStatus)
      .then(response => response.json())
  }

  updateRole(role) {
    return this.authenticate()
      .then(() =>
        fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/roles/${role.get('_id')}`, {
          method: 'PUT',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: role.get('name'),
            description: role.get('description'),
            applicationId: role.get('applicationId'),
            applicationType: role.get('applicationType'),
            permissions: role.get('permissions').toJS()
          })
        }))
      .then(checkStatus)
      .then(response => response.json())
  }

  removeNestedGroup(clientId, teamId) {
    return this.authenticate()
      .then(() =>
        fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${clientId}/nested`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([teamId])
        }
        ))
  }

  removeGroup(groupId) {
    return this.authenticate()
      .then(() =>
        fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      )
  }

  removeRole(roleId) {
    return this.authenticate()
      .then(() =>
        fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      )
  }

  removeGroupMember(groupId, userId) {
    return this.removeGroupMembers(groupId, [userId])
  }

  removeGroupMembers(groupId, userIdArray) {
    return this.authenticate().then(() =>
      fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}/members`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(userIdArray)
      })
    )
  }

  updateGroup(groupId, name, description) {
    return this.authenticate().then(() =>
      fetch(`https://pulse-digital.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      })
    )
      .then(checkStatus)
      .then(r => r.json())
  }
}
