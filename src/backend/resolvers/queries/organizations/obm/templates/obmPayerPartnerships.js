const _ = require('lodash')

const obmPayerPartnerships = async (
  parent,
  args,
  { pulseCoreDb, pulseDevDb }
) => {
  const [
    obmsJoinedToPayers,
    payerHistoricalDrgNationalLives,
  ] = await Promise.all([
    pulseCoreDb
      .collection('organizations')
      .aggregate(JOIN_OBMS_TO_PAYERS_AGG)
      .toArray(),
    pulseDevDb.collection('payerHistoricalDrgNationalLives').find().toArray(),
  ])

  const nationalLivesBySlug = _.keyBy(payerHistoricalDrgNationalLives, 'slug')

  const result = obmsJoinedToPayers.map(({ payerSlug, ...rest }) => {
    let livesFlattened = {}

    if (payerSlug) {
      if (payerSlug && payerSlug in nationalLivesBySlug) {
        const { structuredLives } = nationalLivesBySlug[payerSlug]

        const initialAcc = {
          commercialMedicalLives: 0,
          commercialMedicalLivesPercent: 0,
          medicareMedicalLives: 0,
          medicareMedicalLivesPercent: 0,
          managedMedicaidMedicalLives: 0,
          managedMedicaidMedicalLivesPercent: 0,
        }

        livesFlattened = structuredLives.reduce(
          (acc, { book, coverage, lives, livesPercent }) => {
            if (
              coverage === 'Medical' &&
              ['Commercial', 'Medicare', 'Managed Medicaid'].includes(book)
            ) {
              const livesKey = _.camelCase(`${book} ${coverage} Lives`)
              const livesPercentKey = _.camelCase(
                `${book} ${coverage} Lives Percent`
              )

              acc[livesKey] = lives
              acc[livesPercentKey] = livesPercent
            }

            return acc
          },
          initialAcc
        )
      }
    }

    return {
      ...rest,
      payerSlug,
      ...livesFlattened,
    }
  })

  return result
}

const JOIN_OBMS_TO_PAYERS_AGG = [
  {
    $match: {
      type: 'Oncology Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'obm_payers',
      localField: '_id',
      foreignField: 'obmId',
      as: 'obmPayerJoinEntries',
    },
  },
  {
    $unwind: {
      path: '$obmPayerJoinEntries',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'obmPayerJoinEntries.payerId',
      foreignField: '_id',
      as: 'payer',
    },
  },
  {
    $project: {
      _id: 0,
      obm: {
        _id: '$_id',
        organization: '$organization',
      },
      payer: {
        $arrayElemAt: ['$payer', 0],
      },
    },
  },
  {
    $project: {
      obmId: '$obm._id',
      obmOrganization: '$obm.organization',
      payerId: '$payer._id',
      payerSlug: '$payer.slug',
      payerOrganization: '$payer.organization',
    },
  },
]

module.exports = obmPayerPartnerships
