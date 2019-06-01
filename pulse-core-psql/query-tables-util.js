const _ = require('lodash')

const chain = async (Model, operations) => {
  let promiseResult = Model

  for (const op of operations) {
    const isOpString = typeof op === 'string'
    const funcStr = isOpString ? op : op.f
    const options = isOpString ? {} : (op.o || {})

    let cb = () => { }
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

module.exports = chain
