const repl = require('repl')
const initializeTables = require('./initialize-tables')

initializeTables().then(models => {
  Object.keys(models).forEach(modelName => {
    global[modelName] = models[modelName];
  });

  let replServer = repl.start({
    prompt: 'sequelize > '
  });

  replServer.context.db = models;
})
