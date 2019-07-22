require('dotenv').load()
const express = require('express')
const bodyParser = require('body-parser')
const LOADER_URI = process.env.LOADER_URI
const MongoClient = require('mongodb').MongoClient

let db

MongoClient.connect(LOADER_URI, (err, client) => {
  if (err) return console.error(err)
  console.log(`-----Connected to MongoDB database system-----`)
  db = client.db('pulse-dev')
})

const app = express()
const port = 2000

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/collections', async (req, res) => {
  const collections = await db.listCollections().toArray()
  res.json(collections.map(({ name }) => name))
})

app.post('/collection', async (req, res) => {
  const createdCollection = await db.createCollection(req.body.collectionName)
  res.send(createdCollection.collectionName)
})

app.post('/upload', async (req, res) => {
  const targetCollection = db.collection(req.body.collectionName)

  await targetCollection.deleteMany()
  await targetCollection.insertMany(req.body.data)

  const persistedData = await targetCollection.find().toArray()

  res.json(persistedData)
})

app.listen(port, () => console.log(`ORION SERVER ONLINE. PORT ${port}!`))
