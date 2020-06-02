const fetch = require('node-fetch')
const _ = require('lodash')

const AQUILA_ROOT = 'http://localhost:1500'
const PQL_ENDPOINT = `${AQUILA_ROOT}/pql`

const aquilaPqlResults = (
  parent,
  { pql },
  { authorization }
) => {
  return fetch(
    PQL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: authorization,
      },
      body: JSON.stringify({ pql })
    }
  )
    .then(res => res.json())
    .then(res => {
      return res.error
        ? res
        : _.sampleSize(res, 50)
    })
}

module.exports = aquilaPqlResults
