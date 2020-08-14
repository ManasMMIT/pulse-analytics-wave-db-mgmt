const _ = require('lodash')

const combineTeamsResources = ({ teams, masterListItemsById }) => {
  if (!teams || !teams.length) {
    console.warn('No teams supplied to combine teams resources')
    // ? can't throw a hard error, since no control over a team being deleted before its users
    // throw new Error('No teams supplied to combine teams resources')
  }
  const teamsResourcesByNodeId = getTeamsResourcesByNodeId(teams)

  const resources = []
  Object.entries(teamsResourcesByNodeId).forEach(
    ([nodeId, teamsNodeResources]) => {
      let combinedTeamsNodeResources = {
        nodeId,
        accounts: [],
        regionalBreakdown: [],
        treatmentPlans: [],
      }

      teamsNodeResources.forEach((teamNodeResource) => {
        const {
          accounts = [],
          regionalBreakdown = [],
          treatmentPlans = [],
        } = teamNodeResource

        addFormattedAccountsToCombinedTeamsNodeResources(
          accounts,
          masterListItemsById,
          combinedTeamsNodeResources
        )
        addFormattedIndRegCombosToCombinedTeamsNodeResources(
          treatmentPlans,
          masterListItemsById,
          combinedTeamsNodeResources
        )

        combinedTeamsNodeResources.regionalBreakdown = regionalBreakdown
      })

      combinedTeamsNodeResources.accounts = _.uniqBy(
        combinedTeamsNodeResources.accounts,
        ({ _id }) => _id.toString()
      )
      resources.push(combinedTeamsNodeResources)
    }
  )

  return resources
}

module.exports = combineTeamsResources

const addFormattedAccountsToCombinedTeamsNodeResources = (
  accounts,
  masterListItemsById,
  combinedTeamsNodeResources
) => {
  accounts.forEach(({ _id }) => {
    const { slug } = masterListItemsById[_id.toString()]
    combinedTeamsNodeResources.accounts = combinedTeamsNodeResources.accounts.concat(
      { _id, slug }
    )
  })
}

const addFormattedIndRegCombosToCombinedTeamsNodeResources = (
  treatmentPlans,
  masterListItemsById,
  combinedTeamsNodeResources
) => {
  treatmentPlans.forEach((treatmentPlan) => {
    const { _id: newId, regimens: newRegimens } = treatmentPlan
    const { name: indicationName } = masterListItemsById[newId.toString()]
    const matchingMasterListReg = newRegimens.map(({ _id }) => {
      const { name } = masterListItemsById[_id.toString()]
      return { _id, name }
    })
    const existingIndication = combinedTeamsNodeResources.treatmentPlans.find(
      ({ _id: existingId }) => existingId.equals(newId)
    )
    if (existingIndication) {
      const combinedRegimens = existingIndication.regimens.concat(
        matchingMasterListReg
      )
      existingIndication.regimens = _.uniqBy(combinedRegimens, ({ _id }) =>
        _id.toString()
      )
    } else {
      combinedTeamsNodeResources.treatmentPlans.push({
        _id: newId,
        name: indicationName,
        regimens: matchingMasterListReg,
      })
    }
  })
}

const getTeamsResourcesByNodeId = (teams) => {
  const userTeamsWithResources = teams.filter(({ resources }) => resources)
  const teamsResources = _.flatten(
    userTeamsWithResources.map(({ resources }) => resources)
  )
  const teamsResourcesByNodeId = _.groupBy(teamsResources, 'nodeId')
  return teamsResourcesByNodeId
}
