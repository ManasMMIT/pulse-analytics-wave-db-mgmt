const repl = require('repl')
const d3 = require('d3-collection')
const csvToJson = require('./create-tables-util/create-regional-tables/csv-to-json')
const initializeTables = require('./initialize-tables')
const chain = require('./query-tables-util')
const Sequelize = require('sequelize')
const processUsersSitemaps = require('./process-users-sitemaps')
const processUsersNodesResources = require('./process-users-nodes-resources')

initializeTables().then(({ models, sequelize }) => {
  Object.keys(models).forEach(modelName => {
    global[modelName] = models[modelName]
  })

  let replServer = repl.start({
    prompt: 'sequelize > '
  })

  replServer.context.d3 = d3
  replServer.context.csvToJson = csvToJson
  replServer.context.chain = chain
  replServer.context.sequelize = sequelize
  replServer.context.Sequelize = Sequelize
  replServer.context.processUsersSitemaps = processUsersSitemaps
  replServer.context.processUsersNodesResources = processUsersNodesResources
})
