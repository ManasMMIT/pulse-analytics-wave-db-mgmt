require('dotenv').load()

const _ = require('lodash')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const morgan = require('morgan')
const api = require('./api')
const pql = require('./pql')

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'api.log'), 
  { flags: 'a' },
)

// Custom morgan token inspired by https://github.com/expressjs/morgan/issues/116
morgan.token('graphql-query', req => {
  const user = req.user['https://random-url-for-extra-user-info']
  const { user_id, username } = user
  const { operationName, variables } = req.body

  const copyOfVariables = _.cloneDeep(variables)

  // ! Don't persist passwords in nested input
  if (copyOfVariables.input.password) copyOfVariables.input.password = true

  return `username: ${username} / userId: ${user_id} / operationName: ${operationName} / operationVariables: ${JSON.stringify(copyOfVariables)}`
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
  })
}

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
  morgan(
    '[:date[iso]] :graphql-query\n', 
    { 
      // skip any query that isn't a mutation
      skip: req => req.body && req.body.query && !req.body.query.match(/mutation/),
      stream: accessLogStream,
    }
  ),
  api
)

app.use(
  '/pql',
  checkJwt,
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(err)
    } else {
      next()
    }
  },
  pql
)

app.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
