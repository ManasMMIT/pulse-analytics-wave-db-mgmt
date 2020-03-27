const getDiffDoc = require('./getDiffDoc')

// ! Only a shallow comparison for now, because the statesData fields on these collections are INTENSE

module.exports = async pulseDev => {
  const comparer = ({
    indication,
    population,
    line,
    regimen,
    book,
    coverage,
    treatmentPlan,
  }) => [
    indication,
    population,
    line,
    regimen,
    book,
    coverage,
    treatmentPlan,
  ].join('|')

  return getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerCombinedStateLives',
    newCollectionName: 'payerCombinedStateLives-MATT_FIX',
  })
}
