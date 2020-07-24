const _ = require('lodash')

const mergeLatestDrgStateMedicalLives = async ({
  timestamp,
  formattedData,
  pulseCoreDb,
}) => {
  const { _id: medicalCoverageId } = await pulseCoreDb
    .collection('coverages')
    .findOne({ name: 'Medical' })

  // remove all docs from formatted data that are 'Medical' coverage
  const dataWithoutMedicareCoverage = formattedData.filter(
    ({ coverageId }) => !medicalCoverageId.equals(coverageId)
  )

  const uniqueMmitOrgs = _.uniqBy(
    formattedData,
    ({ organizationId }) => organizationId
  )

  const uniqueMmitOrgIds = uniqueMmitOrgs.map(
    ({ organizationId }) => organizationId
  )

  const { timestamp: latestTimestamp } = await pulseCoreDb
    .collection('lives.history')
    .findOne(
      {
        source: 'DRG',
        territoryType: 'U.S. State',
      },
      {
        sort: {
          timestamp: -1,
        },
      }
    )

  const latestDrgStateLives = await pulseCoreDb
    .collection('lives.history')
    .find({
      source: 'DRG',
      territoryType: 'U.S. State',
      timestamp: latestTimestamp,
      coverageId: medicalCoverageId,
      organizationId: { $in: uniqueMmitOrgIds },
    })
    .toArray()

  // override source and timestamp to prepare for merging drg
  // medical lives into incoming mmit data; EXCLUDE _id, otherwise _id conflicts
  const drgLivesMaskedAsMmitLives = latestDrgStateLives.map(
    ({ _id, ...row }) => ({
      ...row,
      source: 'MMIT',
      timestamp,
    })
  )

  const dataWithDrgStateMedicalDataMerged = dataWithoutMedicareCoverage.concat(
    drgLivesMaskedAsMmitLives
  )

  return dataWithDrgStateMedicalDataMerged
}

module.exports = mergeLatestDrgStateMedicalLives
