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
  // ! not sure what audience line is needed for; 
  // ! initializing auth0 client on frontend with audience gets tokens that expire as expected without this line in the backend
  audience: 'https://polaris-api.com/',
  issuer: 'https://pulse-polaris.auth0.com/',
  algorithms: ['RS256']
})

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use(
  '/api', 
  checkJwt, 
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(err)
    } else {
      next()
    }
  },
  routes,
)

app.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
