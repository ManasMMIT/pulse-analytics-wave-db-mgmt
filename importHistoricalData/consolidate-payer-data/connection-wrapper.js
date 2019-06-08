const connectToMongoDb = require('../../connect-to-mongodb')
const { getScriptTerminator } = require('../../utils')

const connectionWrapper = callback => async (dbsProps = {}) => {
  let {
    pulseDevDb,
    pulseCoreDb,
    terminateScript
  } = dbsProps

  const areDbsPropsMissing = [pulseDevDb, pulseCoreDb, terminateScript]
    .some(func => !func)

  if (areDbsPropsMissing) {
    const mongoConnection = await connectToMongoDb()
    terminateScript = getScriptTerminator(mongoConnection)
    pulseDevDb = await mongoConnection.db('pulse-dev')
    pulseCoreDb = await mongoConnection.db('pulse-core')
  }

  callback({ pulseDevDb, pulseCoreDb, terminateScript })
}

module.exports = connectionWrapper
