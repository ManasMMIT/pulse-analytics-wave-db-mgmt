const _ = require('lodash')
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

  replServer.context.chain = async (Model, operations) => {
    let promiseResult = Model

    for (const op of operations) {
      const isOpString = typeof op === 'string'
      const funcStr = isOpString ? op : op.f
      const options = isOpString ? {} : (op.o || {})

      let cb = () => {}
      if (!isOpString && op.cb) cb = op.cb

      if (Array.isArray(promiseResult)) {
        promiseResult = await Promise.all(promiseResult.map(p => p[funcStr](options)))
        promiseResult = _.flatten(promiseResult)
        await cb(promiseResult)
      } else {
        promiseResult = await promiseResult[funcStr](options)
        await cb(promiseResult)
      }
    }

    return promiseResult
  }
})
