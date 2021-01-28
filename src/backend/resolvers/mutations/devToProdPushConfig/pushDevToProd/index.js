/*
  FYI: Because mongodump has an option that allows it to output the dump result
  to stdout, it can't use stdout to log regular messages it normally
  logs. As such, it uses stderr to do that even though what it is logging
  isn't necessarily error-related. This means we can't leverage stderr
  to know whether any mongodump ops have failed; instead, we rely on the exit
  codes on the ops. See https://jira.mongodb.org/browse/TOOLS-1565.

  The set -e option in bash scripts makes it so if any command in the
  bash script errors (exit code !== 0), then the whole script terminates
  and errors with that exit code. That in turn will throw an error out
  and the error will bubble upward.
*/
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const runBashScript = require('../../../../utils/runBashScript')

const runScript = async ({ isPushAll, collectionsToPush }) => {
  const path =
    __dirname + (isPushAll ? '/totalDevToProd.sh' : '/isolatedDevToProd.sh')

  await runBashScript({ absolutePath: path, scriptArgs: collectionsToPush })
}

const pushDevToProd = async (
  parent,
  { input: { _id, isPushAll = false } },
  { pulseCoreDb, pulseDevDb },
  info
) => {
  let collectionsToPush = []

  if (_id) {
    _id = ObjectId(_id)

    let [allDevCollections, pushConfig] = await Promise.all([
      pulseDevDb.listCollections().toArray(),
      pulseCoreDb.collection('devToProdPushConfigs').findOne({ _id }),
    ])

    allDevCollections = _.keyBy(allDevCollections, 'name')

    const invalidCollections = []

    // sanitize the incoming arguments to make sure they are valid collection names
    collectionsToPush = pushConfig.collections.filter((collectionName) => {
      const isValidCollection = collectionName in allDevCollections
      if (!isValidCollection) invalidCollections.push(collectionName)
      return isValidCollection
    })

    if (invalidCollections.length > 0) {
      console.error(
        `INVALID COLLECTIONS WERE FILTERED OUT OF PUSH DEV TO PROD:
        ${invalidCollections.join(', ')}`
      )
    }
  }

  console.time('Run bash script')

  await runScript({
    isPushAll,
    collectionsToPush,
  })

  console.timeEnd('Run bash script')

  return 'Success'
}

module.exports = pushDevToProd
