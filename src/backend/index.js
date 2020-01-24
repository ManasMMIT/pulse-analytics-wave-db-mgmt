const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const routes = require('./routes')

const app = express()
const port = 1337

var checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://pulse-polaris.auth0.com/.well-known/jwks.json'
  }),
  // audience: 'https://polaris-api.com/', // ! unclear what audience is supposed to be
  issuer: 'https://pulse-polaris.auth0.com/',
  algorithms: ['RS256']
})

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/api', checkJwt, routes)

app.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
