const _ = require('lodash')

const combineTeamsResources = ({
  teams,
  masterListItemsById,
}) => {
  const userTeamsWithResources = teams
    .filter(({ resources }) => resources)

  const teamsResources = _.flatten(userTeamsWithResources.map(({ resources }) => resources))

  const teamResourcesByNodeId = _.groupBy(teamsResources, 'nodeId')

  const resources = []
  Object.keys(teamResourcesByNodeId).forEach(nodeId => {
    const allNodeResources = teamResourcesByNodeId[nodeId]

    let nodeResources = {
      nodeId,
      accounts: [],
      regionalBreakdown: [],
      treatmentPlans: [],
    }

    allNodeResources.forEach(nodeResource => {
      const {
        accounts = [],
        regionalBreakdown = [],
        treatmentPlans = []
      } = nodeResource

      // ! COMBINE ACCOUNTS
      const formattedAccounts = accounts
        .map(({ _id }) => {
          const { slug } = masterListItemsById[_id.toString()]

          return { _id, slug }
        })

      const combinedAccounts = nodeResources.accounts.concat(formattedAccounts)
      nodeResources.accounts = _.uniqBy(combinedAccounts, (({ _id }) => _id.toString()))

      // ! COMBINE TREATMENT PLANS
      treatmentPlans.forEach(treatmentPlan => {
        const { _id: newId, regimens: newRegimens } = treatmentPlan

        const { name: indicationName } = masterListItemsById[newId.toString()]

        const matchingMasterListReg = newRegimens
          .map(({ _id }) => {
            const { name } = masterListItemsById[_id.toString()]

            return { _id, name }
          })

        const existingIndication = nodeResources.treatmentPlans
          .find(({ _id: existingId }) => existingId.equals(newId))

        if (existingIndication) {
          const combinedRegimens = existingIndication.regimens
            .concat(matchingMasterListReg)

          existingIndication.regimens = _.uniqBy(combinedRegimens, ({ _id }) => _id.toString())
        } else {
          nodeResources.treatmentPlans
            .push({
              _id: newId,
              name: indicationName,
              regimens: matchingMasterListReg,
            })
        }
      })

      // ! Only take last regional breakdown
      nodeResources.regionalBreakdown = regionalBreakdown
    })

    resources.push(nodeResources)
  })

  return resources
}

module.exports = combineTeamsResources
