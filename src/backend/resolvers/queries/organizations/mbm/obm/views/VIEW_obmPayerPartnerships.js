import getPayerPartnerLivesAggPipelines from '../../getPayerPartnerLivesAggPipeline'

const VIEW_OBM_PAYER_PARTNERSHIPS_AGG_PIPELINE = [
  ...getPayerPartnerLivesAggPipelines('obm'),
  {
    $group: {
      _id: {
        _id: '$_id',
        obmId: '$mbm._id',
        obmOrganization: '$mbm.organization',
        payerId: '$payer._id',
        payerSlug: '$payer.slug',
        payerOrganization: '$payer.organization',
      },
      bookObjs: {
        $push: '$$ROOT',
      },
    },
  },
  {
    $project: {
      _id: '$_id._id',
      obmId: '$_id.obmId',
      obmOrganization: '$_id.obmOrganization',
      payerId: '$_id.payerId',
      payerSlug: '$_id.payerSlug',
      payerOrganization: '$_id.payerOrganization',
      bookObjs: {
        $map: {
          input: '$bookObjs',
          in: {
            book: '$$this.book',
            isNational: '$$this.isNational',
            states: '$$this.states',
            lives: '$$this.payer.lives',
            livesPercent: '$$this.payer.livesPercent',
          },
        },
      },
    },
  },
]

// Refer to type VIEW_ObmPayerPartnership in src/backend/typeDefs/queries.js for desired schema output
const VIEW_obmPayerPartnerships = async (parent, args, { pulseDevDb }) => {
  const data = await pulseDevDb
    .collection('obmsPayers')
    .aggregate(VIEW_OBM_PAYER_PARTNERSHIPS_AGG_PIPELINE, { allowDiskUse: true })
    .toArray()

  const formattedData = data.map(
    ({
      _id,
      obmId,
      obmOrganization,
      payerId,
      payerSlug,
      payerOrganization,
      bookObjs,
    }) => {
      const flattenedBooksData = bookObjs.reduce(
        (acc, { book, isNational, states, lives, livesPercent }) => {
          if (book === 'Commercial') {
            acc['commercialMedicalLives'] = lives
            acc['commercialMedicalLivesPercent'] = livesPercent
            acc['commercialReach'] = isNational
              ? 'National'
              : states.sort().join(', ')
          } else if (book === 'Medicare') {
            acc['medicareMedicalLives'] = lives
            acc['medicareMedicalLivesPercent'] = livesPercent
            acc['medicareReach'] = isNational
              ? 'National'
              : states.sort().join(', ')
          } else if (book === 'Managed Medicaid') {
            acc['managedMedicaidMedicalLives'] = lives
            acc['managedMedicaidMedicalLivesPercent'] = livesPercent
            acc['managedMedicaidReach'] = isNational
              ? 'National'
              : states.sort().join(', ')
          }

          return acc
        },
        {}
      )

      return {
        _id,
        obmId,
        obmOrganization,
        payerId,
        payerSlug,
        payerOrganization,
        ...flattenedBooksData,
      }
    }
  )

  return formattedData
}

module.exports = VIEW_obmPayerPartnerships
