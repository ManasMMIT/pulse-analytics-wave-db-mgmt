const connectToMongoDb = require('../../connect-to-mongodb')
const { getScriptTerminator } = require('../../utils')

const connectionWrapper = callback => async (dbsProps = {}) => {
  let {
    pulseDevDb,
    pulseCoreDb,
    terminateScript,
    ...rest
  } = dbsProps

  const areDbsPropsMissing = [pulseDevDb, pulseCoreDb, terminateScript]
    .some(func => !func)

  if (areDbsPropsMissing) {
    const mongoConnection = await connectToMongoDb()
    terminateScript = getScriptTerminator(mongoConnection)
    pulseDevDb = await mongoConnection.db('pulse-dev')
    pulseCoreDb = await mongoConnection.db('pulse-core')
  }

  return callback({ pulseDevDb, pulseCoreDb, terminateScript, ...rest })
}

module.exports = connectionWrapper
