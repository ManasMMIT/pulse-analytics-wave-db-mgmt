const payerCombinedStateLives = (
  parent,
  { treatmentPlan },
  { pulseDevDb }
) => {
  const findObj = {
    indication: treatmentPlan.indication,
    regimen: treatmentPlan.regimen,
    line: treatmentPlan.line,
    population: treatmentPlan.population,
    book: treatmentPlan.book,
    coverage: treatmentPlan.coverage,
  }

  return pulseDevDb
    .collection('payerCombinedStateLives')
    .find(findObj)
    .toArray()
}

module.exports = payerCombinedStateLives
