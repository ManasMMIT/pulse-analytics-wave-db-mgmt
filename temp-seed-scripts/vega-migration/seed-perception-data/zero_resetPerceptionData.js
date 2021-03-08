const axios = require('axios')

module.exports = async () => {
  await axios.delete('destroy-all-perception-data')

  console.log('Vega data cleared')
}
