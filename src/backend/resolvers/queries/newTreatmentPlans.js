const isValidIndication = (aspiringIndication, validIndications) => {
  return !!validIndications.find(({ name }) => name === aspiringIndication)
}

const findValidRegimen = (aspiringRegimen, validRegimens) => {
  return validRegimens.find(({ name }) => name === aspiringRegimen)
}

const newTreatmentPlans = async (parent, { data }, { pulseCoreDb }) => {
  const sourceIndications = await pulseCoreDb.collection('indications')
    .find()
    .toArray()

  const sourceRegimens = await pulseCoreDb.collection('regimens')
    .find()
    .toArray()

  const result = {}
  for (const indication in data) {
    if (!isValidIndication(indication, sourceIndications)) {
      continue
    }

    const indicationRegimens = data[indication]

    const newRegimens = indicationRegimens.map(indicationRegimen => {
      const sourceIndicationRegimens = sourceIndications
        .find(({ name }) => indication === name)
        .regimens
      const isNewRegimenForIndication = !sourceIndicationRegimens
        .find(({ name }) => name === indicationRegimen)

      const sourceRegimen = findValidRegimen(indicationRegimen, sourceRegimens)

      if (
        isNewRegimenForIndication
          && sourceRegimen
      ) {
        return sourceRegimen
      } else {
        return false
      }
    })
    
    const filteredNewRegimens = newRegimens.filter(regimen => regimen)

    if (filteredNewRegimens.length) result[indication] = filteredNewRegimens
  }

  return result
}

module.exports = newTreatmentPlans
