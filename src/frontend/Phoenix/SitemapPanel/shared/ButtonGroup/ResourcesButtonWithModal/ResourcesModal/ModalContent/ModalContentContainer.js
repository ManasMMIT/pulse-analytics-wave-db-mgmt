import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import PropTypes from 'prop-types'

import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

import ModalContent from './ModalContent'

import {
  GET_TEAMS,
  GET_SOURCE_INDICATIONS,
  GET_SOURCE_TOOLS,
  GET_TOOL_DASHBOARDS,
  GET_DASHBOARD_PAGES,
  GET_PAGE_CARDS,
} from 'frontend/api/queries'

import useMbmOrganizations from 'frontend/hooks/useMbmOrganizations'

import {
  TOOL_ID_TO_ORG_QUERY_MAP,
  MBM_TOOL_ID,
} from './toolId-to-org-query-map'

const Soil = (props) => {
  const location = useLocation()
  const {
    toolId: selectedToolId,
    dashboardId: selectedDashboardId,
    pageId: selectedPageId,
    cardId: selectedCardId,
  } = (location.search && queryString.parse(location.search)) || {}

  const {
    data: toolsData,
    loading: toolsLoading,
    error: toolsError,
  } = useQuery(GET_SOURCE_TOOLS)
  const {
    data: dashboardsData,
    loading: dashboardsLoading,
    error: dashboardsError,
  } = useQuery(GET_TOOL_DASHBOARDS, {
    variables: { parentId: selectedToolId },
  })
  const {
    data: pagesData,
    loading: pagesLoading,
    error: pagesError,
  } = useQuery(GET_DASHBOARD_PAGES, {
    variables: { parentId: selectedDashboardId },
  })
  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
  } = useQuery(GET_PAGE_CARDS, {
    variables: { parentId: selectedPageId },
  })

  if (
    toolsLoading ||
    dashboardsLoading ||
    (selectedDashboardId && pagesLoading) ||
    (selectedPageId && cardsLoading)
  )
    return 'Loading...'

  if (toolsError || dashboardsError || pagesError || cardsError) return 'Error!'

  const selectedTool = toolsData.nodes.find(({ _id }) => _id === selectedToolId)
  const selectedDashboard =
    dashboardsData.nodes.find(({ _id }) => _id === selectedDashboardId) || null
  const selectedPage =
    (selectedDashboardId &&
      pagesData.nodes.find(({ _id }) => _id === selectedPageId)) ||
    null
  const selectedCard =
    (selectedPageId &&
      cardsData.nodes.find(({ _id }) => _id === selectedCardId)) ||
    null

  const flatSelectedNodes = [
    selectedTool,
    selectedDashboard,
    selectedPage,
    selectedCard,
  ]

  return (
    <Crust
      {...props}
      selectedToolId={selectedToolId}
      flatSelectedNodes={_.compact(flatSelectedNodes)}
    />
  )
}

const Crust = (props) => {
  const { selectedToolId } = props

  if (selectedToolId === MBM_TOOL_ID) {
    return <Mantle1 {...props} />
  }

  return <Mantle2 {...props} />
}

const Mantle1 = (props) => {
  const { clientId, teamId } = useParams()

  const {
    data: teamsData,
    loading: teamLoading,
    error: teamError,
  } = useQuery(GET_TEAMS, { variables: { clientId } })

  const { data: indData, loading: indLoading, error: indError } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useMbmOrganizations()

  const selectedTeamData =
    !teamLoading && !teamError
      ? teamsData.teams.find(({ _id }) => _id === teamId)
      : {}

  return (
    <OuterCore
      teamLoading={teamLoading}
      orgLoading={orgLoading}
      indLoading={indLoading}
      teamError={teamError}
      orgError={orgError}
      indError={indError}
      selectedTeamData={selectedTeamData}
      indData={indData}
      orgData={orgData}
      {...props}
    />
  )
}

const Mantle2 = (props) => {
  const { clientId, teamId } = useParams()

  const {
    data: teamsData,
    loading: teamLoading,
    error: teamError,
  } = useQuery(GET_TEAMS, { variables: { clientId } })

  const { data: indData, loading: indLoading, error: indError } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  // For organizations, use selectedToolId and TOOL_ID_TO_ORG_QUERY_MAP to execute the
  // appropriate query doc for organizations (a tool's child node should only have a subset of
  // a tool's accounts)
  const { data: orgData, loading: orgLoading, error: orgError } = useQuery(
    TOOL_ID_TO_ORG_QUERY_MAP[props.selectedToolId]
  )

  const selectedTeamData =
    !teamLoading && !teamError
      ? teamsData.teams.find(({ _id }) => _id === teamId)
      : {}

  return (
    <OuterCore
      teamLoading={teamLoading}
      orgLoading={orgLoading}
      indLoading={indLoading}
      teamError={teamError}
      orgError={orgError}
      indError={indError}
      selectedTeamData={selectedTeamData}
      indData={indData}
      orgData={orgData}
      {...props}
    />
  )
}

const OuterCore = ({
  teamLoading,
  orgLoading,
  indLoading,
  teamError,
  orgError,
  indError,
  selectedTeamData,
  indData,
  orgData,
  nodeId,
  flatSelectedNodes,
  nodeType,
  closeModal,
  selectedTeamNode,
}) => {
  if (teamLoading || orgLoading || indLoading)
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size={32} />
          <div
            style={{
              color: Colors.PRIMARY,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginTop: Spacing.LARGE,
            }}
          >
            Loading Resources
          </div>
        </div>
      </div>
    )
  if (teamError || orgError || indError) return 'Error!'

  // STEP 1: Isolate the resources object corresponding to
  // the selected team and its selected node.
  // If it doesn't exist or only partially exists, initialize it
  // and its parts as needed.
  let { _id: teamId, resources } = selectedTeamData
  if (!resources) resources = []

  let enabledResources = resources.find(
    ({ nodeId: resourcesObjNodeId }) => resourcesObjNodeId === nodeId
  )

  // if nodeId and/or any resource type keys don't exist on
  // enabledResources, initialize them.
  // otherwise, use pre-existing values (order of merging is important).
  enabledResources = _.merge(
    { nodeId, treatmentPlans: [], accounts: [] },
    enabledResources // <-- even if this is undefined, _.merge works
  )

  // STEP 2: Time to use the master lists.
  // If the node is a tool, its resources are compared against master lists.
  // If the node isn't a tool, its resources are compared against its parent's resources.
  // But the parent's resources are dehydrated so hydrate them with the master lists.
  // Leave the responsibility for diffing the resources up to the tab content
  // further down the React tree.
  const { indications: sourceTreatmentPlans } = indData

  // ! HACK: Need to do below line because orgData comes back as object with variable key of
  // ! 'payerOrganizations', 'pathwaysOrganizations', etc.
  const sourceAccounts = orgData[Object.keys(orgData)[0]]

  const currentNode = flatSelectedNodes.find(({ _id }) => _id === nodeId) || {
    text: { title: 'loading' },
  }

  const parentNode =
    flatSelectedNodes.find(({ _id }) => _id === currentNode.parentId) ||
    currentNode
  if (nodeType === 'tools') {
    const sourceResources = {
      treatmentPlans: sourceTreatmentPlans,
      accounts: sourceAccounts,
    }

    return (
      <ModalContent
        nodeId={nodeId}
        nodeType={nodeType}
        currentNode={currentNode}
        parentNode={parentNode}
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
    { nodeId: parentId, treatmentPlans: [], accounts: [] },
    parentResources // <-- even if this is undefined, _.merge works
  )

  parentResources.treatmentPlans = parentResources.treatmentPlans.map(
    (indObj) => {
      const sourceIndObjCopy = _.cloneDeep(
        sourceTreatmentPlans.find(({ _id }) => _id === indObj._id)
      )

      sourceIndObjCopy.regimens = sourceIndObjCopy.regimens.filter(
        ({ _id }) => {
          return (
            indObj.regimens &&
            indObj.regimens.length &&
            indObj.regimens.find(({ _id: regimenId }) => regimenId === _id)
          )
        }
      )

      return sourceIndObjCopy
    }
  )

  parentResources.accounts = sourceAccounts.filter(({ _id }) => {
    return parentResources.accounts.find(
      ({ _id: accountId }) => accountId === _id
    )
  })

  return (
    <ModalContent
      nodeId={nodeId}
      nodeType={nodeType}
      currentNode={currentNode}
      parentNode={parentNode}
      enabledResources={enabledResources}
      resources={parentResources}
      teamId={teamId}
      closeModal={closeModal}
    />
  )
}

Soil.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  selectedTeamNode: PropTypes.object,
  closeModal: PropTypes.func,
}

Soil.defaultProps = {
  selectedTeamNode: {},
}

export default Soil
