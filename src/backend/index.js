require('dotenv').config()

const _ = require('lodash')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const morgan = require('morgan')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = 1337

const routes = require('./routes')
routes.set('io', io)

var checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://pulse-polaris.auth0.com/.well-known/jwks.json',
  }),
  // ! not sure what audience line is needed for;
  // ! initializing auth0 client on frontend with audience gets tokens that expire as expected without this line in the backend
  audience: 'https://polaris-api.com/',
  issuer: 'https://pulse-polaris.auth0.com/',
  algorithms: ['RS256'],
})

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'api.log'), { flags: 'a' })

// Custom morgan token inspired by https://github.com/expressjs/morgan/issues/116
morgan.token('graphql-query', (req) => {
  const user = req.user['https://random-url-for-extra-user-info']
  const { user_id, username } = user
  const { operationName, variables } = req.body

  const copyOfVariables = _.cloneDeep(variables)

  if (copyOfVariables.input) {
    // ! Don't persist passwords in nested input
    if (copyOfVariables.input.password) copyOfVariables.input.password = true

    // ! Don't persist huge amounts of workbook data in the oplog,
    // ! also results in VERY heavy reads
    if (
      Array.isArray(copyOfVariables.input) &&
      !_.isEmpty(copyOfVariables.input[0]) &&
      copyOfVariables.input[0].wb
    ) {
      copyOfVariables.input.forEach((workbookObj) => {
        workbookObj.data = []
      })
    }
  }

  return `username: ${username} / userId: ${user_id} / operationName: ${operationName} / operationVariables: ${JSON.stringify(
    copyOfVariables
  )}`
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
  morgan('[:date[iso]] :graphql-query\n', {
    // skip any query that doesn't have a body, body.query, or whose body.query isn't a mutation
    skip: (req) => {
      if (!req.body) return true
      if (!req.body.query) return true
      if (!req.body.query.match(/mutation/)) return true
    },
    stream: accessLogStream,
  }),
  routes
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'build')))

  app.get('/*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
  })
}

server.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
