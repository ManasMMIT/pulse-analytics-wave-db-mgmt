const formatQualityAccessDoc = ({
  slug,
  organization,
  indication,
  population,
  line,
  book,
  coverage,
  regimen,
  accessData,
  tierData,
  project,
  timestamp,
  dateParts: {
    month,
    year,
  }
}) => {
  let access = accessData
    ? accessData.access
    : null

  let tierObj = tierData || { tier: null }

  return {
    slug,
    book,
    coverage,
    organization,
    indication,
    population,
    line,
    regimen,
    access,
    ...tierObj,
    project,
    timestamp,
    month,
    year,
  }
}

const formatAdditionalCriteriaDoc = ({
  slug,
  organization,
  indication,
  population,
  line,
  book,
  coverage,
  regimen,
  additionalCriteriaData,
  project,
  timestamp,
  dateParts: {
    month,
    year,
  }
}) => {
  return {
    slug,
    organization,
    indication,
    population,
    line,
    book,
    coverage,
    regimen,
    ...additionalCriteriaData,
    project,
    timestamp,
    month,
    year,
  }
}

const formatCombinedDataDoc = ({
  slug,
  organization,
  coverage,
  book,
  line,
  indication,
  regimen,
  population,
  timestamp,
  project,
  dateParts: {
    month,
    year,
  },
  policyLinkData = {},
  accessData,
  tierData,
  additionalCriteriaData,
}) => {
  let accessObj = {}
  if (accessData) {
    const { _id, ...accessRest } = accessData

    accessObj = accessRest
  }

  let tierObj = tierData || { tier: null }

  return {
    slug,
    organization,
    coverage,
    book,
    line,
    indication,
    regimen,
    population,
    project,
    timestamp,
    month,
    year,
    ...accessObj,
    ...tierObj,
    ...policyLinkData, // ? guessing project field here should just overwrite other top-level field for now
    ...additionalCriteriaData,
  }
}

module.exports = {
  formatQualityAccessDoc,
  formatAdditionalCriteriaDoc,
  formatCombinedDataDoc,
}
