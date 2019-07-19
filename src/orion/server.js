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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/getCollections', async (req, res) => {
  const collections = await db.listCollections().toArray()
  res.json(collections.map(({ name }) => name))
})

app.listen(port, () => console.log(`ORION SERVER ONLINE. PORT ${port}!`))
