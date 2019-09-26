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

  const regimens = await pulseCoreDb.collection('regimens')
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
      const newRegimenForIndication = !sourceIndicationRegimens
        .find(({ name }) => name === indicationRegimen)

      const sourceRegimen = findValidRegimen(indicationRegimen, regimens)

      if (
        newRegimenForIndication
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
