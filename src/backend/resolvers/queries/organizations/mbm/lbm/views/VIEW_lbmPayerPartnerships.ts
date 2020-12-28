import getPayerPartnerLivesAggPipelines from '../../getPayerPartnerLivesAggPipeline'

const VIEW_LBM_PAYER_PARTNERSHIPS_AGG_PIPELINE = [
  ...getPayerPartnerLivesAggPipelines('lbm'),
  {
    $group: {
      _id: {
        _id: '$_id',
        lbmId: '$mbm._id',
        lbmOrganization: '$mbm.organization',
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
      lbmId: '$_id.lbmId',
      lbmOrganization: '$_id.lbmOrganization',
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
const VIEW_lbmPayerPartnerships = async (parent, args, { pulseDevDb }) => {
  const data = await pulseDevDb
    .collection('lbmsPayers')
    .aggregate(VIEW_LBM_PAYER_PARTNERSHIPS_AGG_PIPELINE, { allowDiskUse: true })
    .toArray()

  const formattedData = data.map(
    ({
      _id,
      lbmId,
      lbmOrganization,
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
        lbmId,
        lbmOrganization,
        payerId,
        payerSlug,
        payerOrganization,
        ...flattenedBooksData,
      }
    }
  )

  return formattedData
}

export default VIEW_lbmPayerPartnerships
