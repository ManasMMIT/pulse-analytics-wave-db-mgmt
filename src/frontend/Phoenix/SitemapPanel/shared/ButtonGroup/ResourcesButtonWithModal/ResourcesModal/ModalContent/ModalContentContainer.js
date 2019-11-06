import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ModalContent from './ModalContent'

import {
  GET_SELECTED_TEAM,
  GET_SOURCE_INDICATIONS,
  GET_ORGANIZATIONS,
} from '../../../../../../../api/queries'

const ModalContentContainer = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
  closeModal,
}) => {
  const {
    data: selectedTeamData,
    loading: teamLoading,
    error: teamError,
   } = useQuery(GET_SELECTED_TEAM)

  const {
    data: indData,
    loading: indLoading,
    error: indError,
  } = useQuery(GET_SOURCE_INDICATIONS)

  // ! HACK: if it's not a tool, get ALL the organizations
  // ! because you need them to hydrate the parent resources
  // TODO: Make a new resolver that traverses upward and finds
  // the appropriate toolId to filter by
  let orgsQueryVars = {}
  if (nodeType === 'tools') {
    orgsQueryVars = { variables: { toolId: nodeId } }
  }

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(
    GET_ORGANIZATIONS,
    orgsQueryVars,
  )

  if (teamLoading || indLoading || orgLoading) return 'Loading...'
  if (teamError || indError || orgError) return 'Error!'

  // STEP 1: Isolate the resources object corresponding to
  // the selected team and its selected node.
  // If it doesn't exist or only partially exists, initialize it
  // and its parts as needed.
  let { selectedTeam: { _id: teamId, resources } } = selectedTeamData
  if (!resources) resources = []

  let enabledResources = resources.find(
    ({ nodeId: resourcesObjNodeId }) => resourcesObjNodeId === nodeId
  )

  // if nodeId and/or any resource type keys don't exist on
  // enabledResources, initialize them.
  // otherwise, use pre-existing values (order of merging is important).
  enabledResources = _.merge(
    { nodeId, regionalBreakdown: [], treatmentPlans: [], accounts: [] },
    enabledResources, // <-- even if this is undefined, _.merge works
  )

  // STEP 2: Get all available options for every resource type.
  // If the node is a tool, its resources are compared against master lists.
  // If the node isn't a tool, its resources are compared against its parent's resources.
  // But the parent's resourced are dehydrated so hydrate them with the master lists.
  // Leave the responsibility for diffing the resources up to the tab content
  // further down the React tree.

  const { indications: sourceTreatmentPlans } = indData
  const { organizations: sourceAccounts } = orgData

  if (nodeType === 'tools') {
    const sourceResources = {
      treatmentPlans: sourceTreatmentPlans,
      accounts: sourceAccounts,
      // regionalBreakdown: sourceRegionalBreakdown,
    }

    return (
      <ModalContent
        nodeId={nodeId}
        nodeType={nodeType}
        handlers={handlers}
        selectedTeamNode={selectedTeamNode}
        enabledResources={enabledResources}
        resources={sourceResources}
        teamId={teamId}
        closeModal={closeModal}
      />
    )
  }

  const parentId = selectedTeamNode.parentId

  let parentResources = resources.find(
    ({ nodeId: resourcesObjNodeId }) => resourcesObjNodeId === parentId
  )

  // if nodeId and/or any resource type keys don't exist on
  // parentResources, initialize them.
  // otherwise, use pre-existing values (order of merging is important).
  parentResources = _.merge(
    { nodeId: parentId, regionalBreakdown: [], treatmentPlans: [], accounts: [] },
    parentResources, // <-- even if this is undefined, _.merge works
  )

  parentResources.treatmentPlans = parentResources.treatmentPlans.map(indObj => {
    const sourceIndObjCopy = _.cloneDeep(
      sourceTreatmentPlans.find(({ _id }) => _id === indObj._id)
    )

    sourceIndObjCopy.regimens = sourceIndObjCopy.regimens.filter(({ _id }) => {
      return (
        indObj.regimens
          && indObj.regimens.length
          && indObj.regimens.find(({ _id: regimenId }) => regimenId === _id)
      )
    })

    return sourceIndObjCopy
  })

  parentResources.accounts = sourceAccounts.filter(({ _id }) => {
    return (
      parentResources.accounts.find(
        ({ _id: accountId }) => accountId === _id
      )
    )
  })

  return (
    <ModalContent
      nodeId={nodeId}
      nodeType={nodeType}
      handlers={handlers}
      selectedTeamNode={selectedTeamNode}
      enabledResources={enabledResources}
      resources={parentResources}
      teamId={teamId}
      closeModal={closeModal}
    />
  )
}

ModalContentContainer.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
  selectedTeamNode: PropTypes.object,
  closeModal: PropTypes.func,
}

ModalContentContainer.defaultProps = {
  nodeId: null,
  nodeType: null,
  handlers: {},
  selectedTeamNode: {},
  closeModal: null,
}

export default ModalContentContainer
