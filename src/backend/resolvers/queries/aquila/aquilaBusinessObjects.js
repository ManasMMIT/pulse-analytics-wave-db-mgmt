const fetch = require('node-fetch')

const AQUILA_ROOT = 'http://localhost:1500'
const FILTER_CONFIG_ENDPOINT = `${AQUILA_ROOT}/filter-config-options`

const aquilaBusinessObjects = (
  parent,
  args,
  { authorization }
) => {
  return fetch(
    FILTER_CONFIG_ENDPOINT,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: authorization,
      },
    }
  ).then(res => res.json())
}

module.exports = aquilaBusinessObjects
