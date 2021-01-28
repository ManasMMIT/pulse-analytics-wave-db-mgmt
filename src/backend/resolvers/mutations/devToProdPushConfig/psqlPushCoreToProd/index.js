const runBashScript = require('../../../../utils/runBashScript')

const psqlPushCoreToProd = async () => {
  const path = __dirname + '/resolverScript.sh'

  await runBashScript({ absolutePath: path })

  return 'Success'
}

if (require.main === module) {
  psqlPushCoreToProd()
}

module.exports = psqlPushCoreToProd
