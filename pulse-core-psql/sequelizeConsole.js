const repl = require('repl')
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

  replServer.context.chain = chain
  replServer.context.sequelize = sequelize
  replServer.context.Sequelize = Sequelize
  replServer.context.processUsersSitemaps = processUsersSitemaps
  replServer.context.processUsersNodesResources = processUsersNodesResources
})
