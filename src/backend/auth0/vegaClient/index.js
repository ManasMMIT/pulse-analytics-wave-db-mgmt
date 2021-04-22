require('dotenv').config()
const axios = require('axios')

const {
  auth0_vega_api_clientid,
  auth0_vega_api_secret,
  auth0_vega_api_url,
  auth0_vega_api_audience,
  VEGA_PROXY_URL,
} = process.env

const VegaClient = require('./VegaClient')

const vegaClient = new VegaClient(auth0_vega_api_url, {
  audience: auth0_vega_api_audience,
  clientId: auth0_vega_api_clientid,
  clientSecret: auth0_vega_api_secret,
})

axios.defaults.baseURL = `${VEGA_PROXY_URL}/api/`

axios.interceptors.request.use(
  async (config) => {
    await vegaClient.authenticate()
    config.headers['Authorization'] = `Bearer ${vegaClient.accessToken}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

module.exports = vegaClient
