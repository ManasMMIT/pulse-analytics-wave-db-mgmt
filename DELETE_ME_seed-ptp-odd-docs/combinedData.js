const getDiffDoc = require('./getDiffDoc')

// ! caption is skipped for now because keys/values aren't standard

// ! all criteria fields are skipped because in
// ! the old collection, it's nested under the additionalCriteria field, while in the new collection it's flat.

// TODO We should match the two collections in the seed file.

module.exports = async pulseDev => {
  const comparer = ({
    access,
    accessTiny,
    book,
    // caption,
    color,
    coverage,
    indication,
    internalTeamUse,
    line,
    month,
    organization,
    paLink,
    policyLink,
    population,
    project,
    regimen,
    score,
    siteLink,
    slug,
    sortOrder,
    tier,
    tierRating,
    tierTotal,
    year,
  }) => [
    access,
    accessTiny,
    book,
    // caption,
    color,
    coverage,
    indication,
    internalTeamUse,
    line,
    month,
    organization,
    paLink,
    policyLink,
    population,
    project,
    regimen,
    score,
    siteLink,
    slug,
    sortOrder,
    tier,
    tierRating,
    tierTotal,
    year,
  ].join('|')

  return getDiffDoc({
    db: pulseDev,
    comparer,
    oldCollectionName: 'payerHistoricalCombinedData',
    newCollectionName: 'payerHistoricalCombinedData-MATT_TEST',
  })
}
