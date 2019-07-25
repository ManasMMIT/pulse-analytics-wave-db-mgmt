const promiseDelayMS = require('./promiseDelayMS')

module.exports = () => new Promise(resolve => setTimeout(resolve, promiseDelayMS))
