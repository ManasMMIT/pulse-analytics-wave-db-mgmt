const express = require('express')
const auth0 = require('./auth0')
const psql = require('./psql')

const subApp = express()

subApp.get('/test', (req, res) => {
  res.send('yo')
})

subApp.get('/clients', async (req, res) => {
  auth0.clients.find()
  psql.clients.find()
})

subApp.get('/clients/:id', async (req, res) => {
  const { id } = req.params
  
  auth0.clients.find(id)
  psql.clients.find(id)
})

subApp.post('/clients', async (req, res) => {
  psql.clients.create()
    .then(client => {
      auth0.clients.create(client)
    })
})

subApp.patch('/clients/:id', async (req, res) => {
  const { id } = req.params

  auth0.clients.update(id)
  psql.clients.update(id)
})

subApp.delete('/clients/:id', async (req, res) => {
  const { id } = req.params

  auth0.clients.delete(id)
  psql.clients.delete(id)
})

// ! Next Steps:
// subApp.get('/roles', (req, res) => {
//   auth0.roles.find()
//   psql.roles.find()
// })

// subApp.post('/roles', (req, res) => {
//   auth0.roles.find()
//   psql.roles.find()
// })

// subApp.patch('/roles', (req, res) => {
//   auth0.roles.find()
//   psql.roles.find()
// })

// subApp.delete('/roles', (req, res) => {
//   auth0.roles.find()
//   psql.roles.find()
// })

// subApp.get('/users', (req, res) => {
//   auth0.users.find()
//   psql.users.find()
// })

// subApp.post('/users', (req, res) => {
//   // create own uuid for user and save in psql and auth0

//   auth0.users.find()
//   psql.users.find()
// })

// subApp.patch('/users', (req, res) => {
//   auth0.users.find()
//   psql.users.find()
// })

// subApp.delete('/users', (req, res) => {
//   auth0.users.find()
//   psql.users.find()
// })

module.exports = subApp
