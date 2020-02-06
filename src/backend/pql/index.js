require('dotenv').load()
const _ = require('lodash')

const express = require('express')

const MongoClient = require('mongodb').MongoClient

const subApp = express()

const getPqlResult = require('./getPqlResult')

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

  subApp.post('/', async ({ body: { pql } }, res, next) => {
    const result = await getPqlResult(pql, mongoStuff)

    res.json(result)
  })
})

module.exports = subApp
