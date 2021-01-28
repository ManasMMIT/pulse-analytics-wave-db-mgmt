// At first was promisifying exec as in: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
// But then couldn't get live-logging as bash script was executing so went for something more like: https://stackoverflow.com/a/46617356
const { exec } = require('child_process')

const runBashScript = ({ absolutePath, scriptArgs = [] }) => {
  const argsAsString = Boolean(scriptArgs.length)
    ? ` ${scriptArgs.join(' ')}`
    : ''

  const promise = new Promise((resolve, reject) => {
    const process = exec(`sh ${absolutePath}${argsAsString}`)

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

  return promise
}

module.exports = runBashScript
