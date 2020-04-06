// ! caption is skipped for now because keys/values aren't standard

// ! all criteria fields are skipped because in
// ! the old collection, it's nested under the additionalCriteria field, while in the new collection it's flat.

// TODO We should match the two collections in the seed file.

module.exports = async getDiffDoc => {
  const comparer = ({
    access,
    // accessTiny,
    book,
    // caption,
    color,
    coverage,
    indication,
    // internalTeamUse,
    line,
    month,
    // organization,
    paLink = null, // if it's not there, sub null for comparison to work
    policyLink = null, // if it's not there, sub null for comparison to work
    population,
    project,
    regimen,
    score,
    siteLink = null, // if it's not there, sub null for comparison to work
    slug,
    sortOrder,
    tier,
    tierRating,
    tierTotal,
    year,
    additionalCriteria,
  }) => [
    access,
    // accessTiny,
    book,
    // caption,
    color,
    coverage,
    indication,
    // internalTeamUse,
    line,
    month,
    // organization,
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
    additionalCriteria
      ? additionalCriteria
        .map(({ criteria, criteriaNote }) => [criteria, criteriaNote].join('|'))
        .sort()
        .join('|')
      : ''
  ].join('|')

  return getDiffDoc({
    comparer,
    collectionName: 'payerHistoricalCombinedData',
  })
}
