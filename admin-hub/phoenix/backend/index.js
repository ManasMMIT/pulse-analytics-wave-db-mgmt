const express = require('express')
const _ = require('lodash')
const routes = require('./routes')

const app = express()
const port = 3000

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
