const mongoQuery = require('./mongo-query')

const pipeDelimitedScript = async (
  parent,
  body,
  { pulseDevDb },
  info
) => mongoQuery(pulseDevDb)

module.exports = pipeDelimitedScript
