const fetch = require('node-fetch')

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

class VegaClient {
  constructor(url, tokenIssuerConfig) {
    this.url = url

    if (!tokenIssuerConfig) {
      throw new Error('Requires tokenIssuerConfig')
    }

    this.audience = tokenIssuerConfig.audience
    this.clientId = tokenIssuerConfig.clientId
    this.clientSecret = tokenIssuerConfig.clientSecret
  }

  isAuthenticated() {
    return this.accessToken && this.expiresAt > new Date().getTime()
  }

  authenticate() {
    if (this.isAuthenticated()) return Promise.resolve()

    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials',
    }

    return fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((json) => {
        this.accessToken = json.access_token
        this.scope = json.scope
        this.expiresAt = json.expires_in * 1000 + new Date().getTime()
      })
  }
}

module.exports = VegaClient
