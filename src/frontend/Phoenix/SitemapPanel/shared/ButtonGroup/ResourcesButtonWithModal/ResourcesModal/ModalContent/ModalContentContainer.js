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

const ContainerForToolNodes = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
  enabledResources,
  teamId,
  closeModal,
}) => {
  const {
    data: indData,
    loading: indLoading,
    error: indError,
  } = useQuery(GET_SOURCE_INDICATIONS)

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(
    GET_ORGANIZATIONS,
    { variables: { toolId: nodeId } },
  )

  if (indLoading || orgLoading) return 'Loading master list options...'
  if (indError || orgError) return 'ERROR loading master list options...'

  const { indications: sourceTreatmentPlans } = indData
  const { organizations: sourceAccounts } = orgData

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

const ModalContentContainer = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
  closeModal,
}) => {
  const { data, loading, error } = useQuery(GET_SELECTED_TEAM)

  if (loading) return null
  if (error) return 'There was an error'

  // STEP 1: Isolate the resources object corresponding to
  // the selected team and its selected node.
  // If it doesn't exist or only partially exists, initialize it
  // and its parts as needed.
  let { selectedTeam: { _id: teamId, resources } } = data
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
  // Leave the responsibility for diffing the resources up to the tab content
  // further down the React tree.
  if (nodeType === 'tools') {
    return (
      <ContainerForToolNodes
        nodeId={nodeId}
        nodeType={nodeType}
        handlers={handlers}
        selectedTeamNode={selectedTeamNode}
        enabledResources={enabledResources}
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
