const fetch = require('node-fetch')

const AQUILA_ROOT = 'http://localhost:1500'
const PLACARD_OPTIONS_ENDPOINT = `${AQUILA_ROOT}/placard-options`

const aquilaBoFilterSettings = (
  parent,
  { boId },
  { authorization }
) => {
  return fetch(
    PLACARD_OPTIONS_ENDPOINT,
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
