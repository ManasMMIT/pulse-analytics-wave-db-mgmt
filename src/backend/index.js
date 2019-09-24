const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()
const port = 1337

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/api', routes)

app.listen(port, () => console.log(`PHOENIX ONLINE. PORT ${port}!`))
