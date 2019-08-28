import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { UnderlinedTabs } from './../../../../../../components/Tabs'
import RegionalBreakdownTab from './RegionalBreakdownTab'

const COMPONENT_MAP = {
  regionalBreakdown: RegionalBreakdownTab
}

const ModalContent = ({
  nodeId,
  nodeType,
  resources,
  handlers,
  teamEntityNodes,
}) => {
  const tabsData = []
  const tabChildren = []
  Object.keys(resources).forEach(resourceType => {
    tabsData.push(_.startCase(resourceType))

    const Component = COMPONENT_MAP[resourceType]

    tabChildren.push(
      <Component
        resources={resources}
        nodeId={nodeId}
        nodeType={nodeType}
        handlers={handlers}
        teamEntityNodes={teamEntityNodes}
      />
    )
  })

  return (
    <UnderlinedTabs tabsData={tabsData}>
      {tabChildren}
    </UnderlinedTabs>
  )
}

ModalContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
  teamEntityNodes: PropTypes.object,
  resources: PropTypes.object,
}

ModalContent.defaultProps = {
  nodeId: null,
  nodeType: null,
  handlers: {},
  teamEntityNodes: {},
  resources: { empty: null }
}

export default ModalContent
