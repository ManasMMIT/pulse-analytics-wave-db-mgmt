import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ModalContent from './ModalContent'

import {
  GET_SELECTED_TEAM,
  GET_SOURCE_INDICATIONS,
  GET_SELECTED_TOOL,
} from '../../../../../../../api/queries'

import { TOOL_ID_TO_ORG_QUERY_MAP } from './toolId-to-org-query-map'

const ModalContentContainer = ({
  nodeId,
  nodeType,
  selectedTeamNode,
  closeModal,
  selectedToolId, // ! HACK: gotten from ANOTHER container wrapping this component because it's needed in org query
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

  // For organizations, use selectedToolId and TOOL_ID_TO_ORG_QUERY_MAP to execute the
  // appropriate query doc for organizations (a tool's child node should only have a subset of
  // a tool's accounts)
  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(TOOL_ID_TO_ORG_QUERY_MAP[selectedToolId])

  if (teamLoading || orgLoading || indLoading) return 'Loading...'
  if (teamError || orgError || indError) return 'Error!'

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

  // STEP 2: Grab the regionalBreakdown for the selectedTool (regardless of 
  // whether the modal is open for the tool itself or a child node) to
  // ready it for copying for when user toggles on regional breakdown for a child node
  const selectedToolResources = resources.find(
    ({ nodeId: resourcesObjNodeId }) => resourcesObjNodeId === selectedToolId
  ) || {}

  const toolRegionalBreakdown = selectedToolResources.regionalBreakdown

  // STEP 3: Time to use the master lists.
  // If the node is a tool, its resources are compared against master lists.
  // If the node isn't a tool, its resources are compared against its parent's resources.
  // But the parent's resources are dehydrated so hydrate them with the master lists.
  // Leave the responsibility for diffing the resources up to the tab content
  // further down the React tree.
  const { indications: sourceTreatmentPlans } = indData
  
  // ! HACK: Need to do below line because orgData comes back as object with variable key of
  // ! 'payerOrganizations', 'pathwaysOrganizations', etc.
  const sourceAccounts = orgData[Object.keys(orgData)[0]]

  if (nodeType === 'tools') {
    const sourceResources = {
      treatmentPlans: sourceTreatmentPlans,
      accounts: sourceAccounts,
    }

    return (
      <ModalContent
        nodeId={nodeId}
        nodeType={nodeType}
        enabledResources={enabledResources}
        toolRegionalBreakdown={toolRegionalBreakdown}
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
      enabledResources={enabledResources}
      toolRegionalBreakdown={toolRegionalBreakdown}
      resources={parentResources}
      teamId={teamId}
      closeModal={closeModal}
    />
  )
}

const ModalOuterContentContainer = props => {
  const {
    data: selectedToolData,
    loading: selectedToolLoading,
    error: toolError,
  } = useQuery(GET_SELECTED_TOOL)

  if (selectedToolLoading) return 'Loading...'
  if (toolError) return 'Error!'

  const { selectedTool: { _id: selectedToolId } } = selectedToolData

  return <ModalContentContainer {...props} selectedToolId={selectedToolId} />
}

ModalOuterContentContainer.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  selectedTeamNode: PropTypes.object,
  closeModal: PropTypes.func,
}

ModalOuterContentContainer.defaultProps = {
  selectedTeamNode: {},
}

export default ModalOuterContentContainer
