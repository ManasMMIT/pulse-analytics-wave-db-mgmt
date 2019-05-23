const repl = require('repl')
const initializeTables = require('./initialize-tables')
const chain = require('./query-tables-util')

initializeTables().then(models => {
  Object.keys(models).forEach(modelName => {
    global[modelName] = models[modelName]
  })

  let replServer = repl.start({
    prompt: 'sequelize > '
  })

  replServer.context.db = models
  replServer.context.chain = chain
})
