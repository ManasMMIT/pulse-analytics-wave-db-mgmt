const getColumnLetter = require('../utils/getColumnLetter')

const pushStakeholderErrors = ({ row, maps, newErrors, rowIdx }) => {
  const {
    person_id,
    first_name,
    last_name,
  } = row

  const {
    stakeholdersMap,
  } = maps

  const isMarketBasketSurveyPerson = stakeholdersMap[person_id] !== undefined
  if (isMarketBasketSurveyPerson) {
    stakeholdersMap[person_id] = true
  } else {
    newErrors.push({
      rowIdx,
      column: getColumnLetter('person_id'),
      error: {
        errorMessage: 'STAKEHOLDER NOT INCLUDED IN MARKET BASKET SURVEY',
        value: `${first_name} ${last_name} (${person_id})`,
        suggestion: undefined
      }
    })
  }
}

module.exports = pushStakeholderErrors
