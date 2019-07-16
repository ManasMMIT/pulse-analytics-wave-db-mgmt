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
      this.audience = opts.tokenIssuerConfig.audience
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
          this.expiresAt = json.expires_in * 1000 + new Date().getTime()
        })
    }

    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials'
    }

    return fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        this.accessToken = json.access_token
        this.scope = json.scope
        this.expiresAt = json.expires_in * 1000 + new Date().getTime()
      })
  }

  getAccessTokenInfo() {
    return {
      access_token: this.accessToken,
      expiresAt: this.expiresAt
    }
  }

  getUsers() {
    const paginateUserRequest = async () => {
      let users = []
      let usersFetched = 0
      let hasNext = true
      let pageNum = 0
      const apiURL = page => `${this.audience}users?per_page=100&page=${ page }&include_totals=true`

      while (hasNext) {
        await new Promise(resolve => {
          fetch(apiURL(pageNum), {
            headers: {
              Authorization: `Bearer ${ this.accessToken }`
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

  createUser(name, email, password) {
    return this.authenticate()
      .then(() =>
        fetch(`${this.audience}users`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ this.accessToken }`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              user_id: '',
              connection: 'Username-Password-Authentication',
              email,
              name,
              username: name,
              password,
              user_metadata: {},
              email_verified: true,
              verify_email: false,
              app_metadata: {}
            })
        })
      )
      .then(checkStatus)
      .then(response => response.json())
  }

  deleteUser(id) {
    return this.authenticate()
      .then(() =>
        fetch(`${this.audience}users/${ id }`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${ this.accessToken }`,
            'Content-Type': 'application/json'
          }
        }))
      .then(response => {
        if (response && !(response.status >= 200 && response.status < 300)) {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
        return id
      })
  }

  // ! ALERT: 'username' in auth0 is coerced into lowercase; not sure why
  updateUser(id, { username, email, password }) {
    // auth0 can't update all the fields in the same request
    // and more specifically, has to do isolated updates
    // of password and email for some reason
    const queryBody1 = { username, name: username }
    const queryBody2 = { password }
    const queryBody3 = { email }

    const patchQuery = bodyObj => () => (
      fetch(`${this.audience}users/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          connection: 'Username-Password-Authentication',
          ...bodyObj,
        }),
      })
    )

    return this.authenticate()
      .then(patchQuery(queryBody1))
      .then(patchQuery(queryBody2))
      .then(patchQuery(queryBody3))
      .then(checkStatus)
      .then(response => response.json())
  }
}
