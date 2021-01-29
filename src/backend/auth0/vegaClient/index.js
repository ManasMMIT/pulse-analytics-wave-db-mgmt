require('dotenv').config()
const axios = require('axios')

const {
  auth0_vega_api_clientid,
  auth0_vega_api_secret,
  auth0_vega_api_url,
  auth0_vega_api_audience,
  DB_CLUSTER_ENV,
} = process.env

const VegaClient = require('./VegaClient')

const vegaClient = new VegaClient(auth0_vega_api_url, {
  audience: auth0_vega_api_audience,
  clientId: auth0_vega_api_clientid,
  clientSecret: auth0_vega_api_secret,
})

axios.defaults.baseURL = ''

switch (DB_CLUSTER_ENV) {
  case 'staging':
    // this means Polaris is using the MongoDB staging cluster
    // and we should connect to Vega LOCALLY and that local Vega
    // should be connected to vega-sandbox DB
    axios.defaults.baseURL = 'http://localhost:8000/api/'
    break
  case 'production':
    // this means Polaris is using the MongoDB prod cluster
    // and we should connect to staging.vega.pulse-tools.com
    // and be aware that that's connected to vega-core DB
    axios.defaults.baseURL = 'https://staging.vega.pulse-tools.com/api/'
    break
  default:
    // if someone were to specify DB_CLUSTER_ENV is 'local' or anything
    // else, point to local Vega which is connected to whatever
    // you want, but probably your own local psql instance
    axios.defaults.baseURL = 'http://localhost:8000/api/'
    break
}

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
