import React from 'react'
import PropTypes from 'prop-types'

import { UnderlinedTabs } from './../../../../../../components/Tabs'
import RegionalBreakdownTabContent from './RegionalBreakdownTabContent'

// 1. regionalBreakdown 
// - find currently selected tool 
// - pluck it out of the selected team's sitemap in (needs tools slice)
// - grab the regionalBreakdown from the tool if it's there
// - use it to prime the toggle (if on, copy; if off, remove)

// the selectedNode, below, does not reflect changes in sitemap panel's state, so it gets behind almost immediately
  // const selectedNode = sitemap[nodeType].find(({ _id }) => _id === nodeId)
  // const { resources } = selectedNode

// 2. Every other type of resource
// - get the resources for the node

const ModalContent = ({
  nodeId,
  nodeType,
  handlers,
  teamTools,
  selectedTeamNode,
}) => {

  if (!selectedTeamNode) return null

  const resources = selectedTeamNode // In case there's no resources field (which shouldn't matter when adding the first resource)
    ? selectedTeamNode.resources
    : {}

  return (
    <UnderlinedTabs tabsData={['Regional Breakdown']}>
      <RegionalBreakdownTabContent
        nodeId={nodeId}
        nodeType={nodeType}
        handlers={handlers}
        resources={resources}
        teamTools={teamTools}
      />
    </UnderlinedTabs>
  )
}

ModalContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
  sitemap: PropTypes.object,
}

ModalContent.defaultProps = {
  nodeId: null,
  nodeType: null,
  handlers: {},
  sitemap: {},
}

export default ModalContent
