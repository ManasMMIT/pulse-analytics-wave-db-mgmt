const repl = require('repl')
const initializeTables = require('./initialize-tables')
const chain = require('./query-tables-util')
const Sequelize = require('sequelize')

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
})
