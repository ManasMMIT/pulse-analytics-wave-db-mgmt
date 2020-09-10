const _ = require('lodash')
const { ObjectId } = require('mongodb')

// At first was promisifying exec as in: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
// But then couldn't get live-logging as bash script was executing so went for something more like: https://stackoverflow.com/a/46617356
const { exec } = require('child_process')

const execWithLogging = (command) =>
  new Promise((resolve, reject) => {
    const process = exec(command)

    process.stdout.on('data', console.log)

    process.stderr.on('data', console.log)

    process.on('exit', (code) => {
      console.log('child process exited with code ' + code)

      if (code !== 0) {
        reject(new Error('Bash script failed'))
      } else {
        resolve('Bash script executed successfully')
      }
    })
  })

const runBashScript = async ({ isPushAll, collectionsToPush }) => {
  const path =
    __dirname + (isPushAll ? '/totalDevToProd.sh' : '/isolatedDevToProd.sh')

  const argsString = collectionsToPush.join(' ')

  /*
    Because mongodump has an option that allows it to output the dump result
    to stdout, it can't use stdout to log regular messages it normally
    logs. As such, it uses stderr to do that even though what it is logging
    isn't necessarily error-related. This means we can't leverage stderr
    to know whether any mongodump ops have failed; instead, we rely on the exit
    codes on the ops. See https://jira.mongodb.org/browse/TOOLS-1565.

    The set -e option in the bash script makes it so if any command in the 
    bash script errors (exit code !== 0), then the whole script terminates 
    and errors with that exit code. That in turn will throw an error out 
    of execWithLogging and the error will bubble upward.
  */
  await execWithLogging(`sh ${path} ${argsString}`)
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

  console.time('Run mongodump and mongorestore bash script')

  await runBashScript({
    isPushAll,
    collectionsToPush,
  })

  console.timeEnd('Run mongodump and mongorestore bash script')

  return 'Success'
}

module.exports = pushDevToProd
