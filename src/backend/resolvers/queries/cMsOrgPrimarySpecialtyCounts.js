const fetch = require('node-fetch')
const _ = require('lodash')

// ! limit is set to max the API will allow and is necessary,
  // ! or results are throttled to 1K.
const getURI = orgPacId => `https://data.medicare.gov/resource/mj5m-pzi6.json?org_pac_id=${orgPacId}&$limit=50000`

const PRIMARY_SPECIALTY_KEY = 'pri_spec'

module.exports = async (
  parent,
  {
    orgPacId,
  },
  { pulseCoreDb }
) => {
  const URI = getURI(orgPacId)

  const cMsResults = await fetch(URI).then(res => res.json())

  const primarySpecialtyCounts = cMsResults.reduce((acc, result) => {
    const primarySpecialty = result[PRIMARY_SPECIALTY_KEY]

    acc[primarySpecialty]
      ? acc[primarySpecialty] += 1
      : acc[primarySpecialty] = 1

    return acc
  }, {})

  // all keys come in UPPER CASE
  return Object.entries(primarySpecialtyCounts).sort()
}
