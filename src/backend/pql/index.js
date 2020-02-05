require('dotenv').load()
const _ = require('lodash')

const express = require('express')

const MongoClient = require('mongodb').MongoClient

const subApp = express()

MongoClient.connect(process.env.LOADER_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const mongoClient = client
  const pulseRawDb = client.db('pulse-raw')
  const pulseDevDb = client.db('pulse-dev')
  const pulseCoreDb = client.db('pulse-core')
  const pulseProdDb = client.db('pulse-prod')

  const coreUsers = pulseCoreDb.collection('users')
  const coreRoles = pulseCoreDb.collection('roles')
  const coreNodes = pulseCoreDb.collection('nodes')
  const coreClients = pulseCoreDb.collection('clients')

  console.log(`PQL Connected to MongoDB: ${process.env.LOADER_URI}`)

  const mongoStuff = {

    // Torso/Backside
    mongoClient,
    pulseRawDb,
    pulseDevDb,
    pulseCoreDb,
    pulseProdDb,

    coreUsers,
    coreRoles,
    coreClients,
    coreNodes,
  }

  subApp.get('/', async (req, res, next) => {

    const user = req.user['https://random-url-for-extra-user-info']

    // const result = await getPqlResult({ req, res, next }, { user, ...mongoStuff })

    // res.json(result)
    res.send('works')
  })
})

module.exports = subApp
