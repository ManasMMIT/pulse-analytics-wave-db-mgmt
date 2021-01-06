import getChildNodes from './getChildNodes'
const _ = require('lodash')

const getResourcesDiff = require('./getResourcesDiff')
const { keyOutTreatmentPlans, arrayifyTreatmentPlans } = require('./utils')

const addAccounts = (targetAccounts, newAccounts) => {
  const targetAccountsByKey = _.keyBy(targetAccounts, '_id')
  const combinedAccounts = _.merge({}, targetAccountsByKey, newAccounts)
  return Object.values(combinedAccounts)
}

const addTreatmentPlans = (targetTps, newTps) => {
  const targetTpsByKey = keyOutTreatmentPlans(targetTps)
  const combinedTps = _.merge({}, targetTpsByKey, newTps)
  return arrayifyTreatmentPlans(combinedTps)
}

const cascadeUpdateResources = ({
  nodes,
  nextResources,
  resourcesAcrossNodes,
}) => {
  // STEP 1: DIFF THE INCOMING ROOT NODE RESOURCES OBJ WITH
  // THE CURRENT VERSION OF IT IN THE DATABASE
  const { nodeId } = nextResources

  const resourcesByNodeId = _.keyBy(_.cloneDeep(resourcesAcrossNodes), 'nodeId')

  const prevResources = resourcesByNodeId[nodeId]

  const {
    accountsToRemove,
    accountsToAdd,
    treatmentPlansToRemove,
    treatmentPlansToAdd,
  } = getResourcesDiff({
    nextResources,
    prevResources,
  })

  // STEP 2: GET ALL THE CHILD NODES OF THE NODE BEING UPDATED
  const nodesByParentId = _.groupBy(nodes, 'parentId')

  const childNodes = getChildNodes(nodeId, nodesByParentId)

  // STEP 3: APPLY THE DIFFS FROM STEP 1 TO EVERY CHILD NODE
  const updatedResources = childNodes.map(({ _id: childId }) => {
    const childPermissionsObj = {
      nodeId: childId,
      accounts: [],
      treatmentPlans: [],
    }

    const targetNodeResourcesObj = resourcesByNodeId[childId]

    if (targetNodeResourcesObj) {
      const {
        accounts: prevAccounts = [],
        treatmentPlans: prevTreatmentPlans = [],
      } = targetNodeResourcesObj

      // REMOVE ACCOUNTS AND TREATMENT PLANS AS NEEDED
      let updatedAccounts = prevAccounts.filter(
        ({ _id }) => !accountsToRemove[_id.toString()]
      )

      let updatedTreatmentPlans = prevTreatmentPlans.reduce((acc, indObj) => {
        if (
          treatmentPlansToRemove.find(
            ({ _id, regimens }) => _id.equals(indObj._id) && regimens === null
          )
        ) {
          return acc
        }

        if (indObj.regimens && indObj.regimens.length) {
          indObj.regimens = indObj.regimens.filter(
            ({ _id: regId }) =>
              !treatmentPlansToRemove.find(
                ({ _id, regimens }) =>
                  indObj._id.equals(_id) && regimens._id.equals(regId)
              )
          )
        }

        acc.push(indObj)
        return acc
      }, [])

      // ADD ACCOUNTS AND TREATMENT PLANS AS NEEDED
      updatedAccounts = addAccounts(updatedAccounts, accountsToAdd)
      updatedTreatmentPlans = addTreatmentPlans(
        updatedTreatmentPlans,
        treatmentPlansToAdd
      )

      childPermissionsObj.accounts = updatedAccounts
      childPermissionsObj.treatmentPlans = updatedTreatmentPlans
    } else {
      childPermissionsObj.accounts = Object.values(accountsToAdd)
      childPermissionsObj.treatmentPlans = arrayifyTreatmentPlans(
        treatmentPlansToAdd
      )
    }

    return childPermissionsObj
  })

  // STEP 4: INCLUDE THE INCOMING ROOT NODE RESOURCES OBJ IN RETURN

  updatedResources.push(nextResources)

  return updatedResources
}

module.exports = cascadeUpdateResources
