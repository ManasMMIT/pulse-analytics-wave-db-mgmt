const tracer = require('dd-trace').init()
require('dotenv').config()

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
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
  routes
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'build')))

  app.get('/*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
  })
}

server.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
