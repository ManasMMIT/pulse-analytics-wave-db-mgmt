const assessFilterParams = require('./assessFilterParams')

// * global indications that are available to ALL users
const GLOBAL_INDICATIONS = ['General', 'N/A']

const PROVIDER_AGG_PIPELINE = [
  {
    $group: {
      _id: {
        year: '$year',
        quarter: '$quarter',
      },
      data: { $push: '$$ROOT' },
    },
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.quarter': -1,
    },
  },
  { $limit: 1 },
  { $unwind: '$data' },
  {
    $replaceRoot: {
      newRoot: '$data',
    },
  },
]

const getIndicationRegimenMatchExpression = treatmentPlans => {
  const combosArr = treatmentPlans.reduce((acc, { name: indication, regimens }) => {
    const indicationRegimenCombos = regimens.map(({ name }) => ({
      $or: [
        { regimen: name },
        { product: name },
      ],
      indication,
    }))

    return [...acc, ...indicationRegimenCombos]
  }, [])

  return { $or: combosArr }
}

const getRegimenMatchExpression = treatmentPlans => {
  const regimenOptions = treatmentPlans.reduce((acc, { regimens }) => {
    const names = regimens.map(({ name }) => name)
    return [...acc, ...names]
  }, [])

  const uniqueRegimens = [...new Set(regimenOptions)]

  const matchArr = [
    {
      regimen: { $in: uniqueRegimens }
    },
    {
      product: { $in: uniqueRegimens }
    },
  ]

  return { $or: matchArr }
}

const getAggPipeline = (collectionName, resources, alertDate) => {
  const {
    accounts,
    treatmentPlans,
    // regionalBreakdown, // ? this prob won't be used here
  } = resources

  const {
    indicationRegimenSlugFieldsExist,
    indicationRegimenFieldsExist,
    regimenSlugFieldsExist,
    indicationSlugFieldsExist,
    indicationFieldExists,
    regimenFieldExists,
    slugFieldExists,
  } = assessFilterParams(collectionName)

  // ? if none of the conditions are met, don't filter by anything
  // ? OR don't return anything
  let result = []

  // ! ALERT: Any indication+regimen filtering is by their COMBINATION, not independently
  // ! ALERT: Any regimen filtering needs to look for keys 'product' OR 'regimen'
  if (indicationRegimenSlugFieldsExist) {
    const slugs = accounts.map(({ slug }) => slug)
    const indRegMatchExpression = getIndicationRegimenMatchExpression(treatmentPlans)

    result = [
      {
        $match: {
          slug: { $in: slugs },
          ...indRegMatchExpression,
        }
      }
    ]
  } else if (indicationRegimenFieldsExist) {
    const indRegMatchExpression = getIndicationRegimenMatchExpression(treatmentPlans)

    result = [
      {
        $match: indRegMatchExpression
      }
    ]
  } else if (regimenSlugFieldsExist) {
    const slugs = accounts.map(({ slug }) => slug)
    const regimenMatchExpression = getRegimenMatchExpression(treatmentPlans)

    result = [
      {
        $match: {
          slug: { $in: slugs },
          ...regimenMatchExpression
        }
      },
    ]
  } else if (indicationSlugFieldsExist) {
    const slugs = accounts.map(({ slug }) => slug)
    const indications = treatmentPlans.map(({ name }) => name)

    result = [
      {
        $match: {
          slug: { $in: slugs },
          indication: { $in: [...indications, ...GLOBAL_INDICATIONS] },
        }
      },
    ]
  } else if (indicationFieldExists) {
    // ! has yet to be tested
    const indications = treatmentPlans.map(({ name }) => name)

    result = [
      {
        $match: {
          indication: { $in: [...indications, ...GLOBAL_INDICATIONS] },
        }
      },
    ]
  } else if (regimenFieldExists) {
    // ! has yet to be tested
    const regimenMatchExpression = getRegimenMatchExpression(treatmentPlans)

    result = [
      {
        $match: regimenMatchExpression
      }
    ]
  } else if (slugFieldExists) {
    // ! has yet to be tested
    const slugs = accounts.map(({ slug }) => slug)

    result = [
      {
        $match: {
          slug: { $in: slugs },
        }
      },
    ]
  }

  if (
    collectionName === `pathwaysHistoricalProviderAdoption`
  ) {
    result = [...result, ...PROVIDER_AGG_PIPELINE]
  } else {
    // ! NOTE: this part of the logic might cause us problems when we
    // ! move onto payer data if that doesn't depend on alertDate
    result = [
      {
        $match: {
          alertDate: {
            $exists: true,
          }
        }
      },
      ...result,
    ]
  }

  return result
}

module.exports = getAggPipeline
