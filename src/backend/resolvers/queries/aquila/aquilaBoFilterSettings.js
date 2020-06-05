const fetch = require('node-fetch')

const AQUILA_ROOT = 'http://localhost:1500'
const BO_FILTER_SETTINGS_ENDPOINT = `${AQUILA_ROOT}/bo-filter-settings`

const aquilaBoFilterSettings = (
  parent,
  { boId },
  { authorization }
) => {
  return fetch(
    BO_FILTER_SETTINGS_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: authorization,
      },
      body: JSON.stringify({ boId })
    }
  ).then(res => res.json())
}

module.exports = aquilaBoFilterSettings
