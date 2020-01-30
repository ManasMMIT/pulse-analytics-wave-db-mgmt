import React from 'react'
import PropTypes from 'prop-types'

import SitemapSwitch from './SitemapSwitch'
import ResourcesButtonWithModal from './ResourcesButtonWithModal'

const ButtonGroup = ({
  sourceEntity,
  handleToggle,
  nodeType,
  teamEntityNodes,
}) => {
  const nodeId = sourceEntity._id
  const selectedTeamNode = teamEntityNodes[nodeId]

  return (
    <>
      <SitemapSwitch
        nodeType={nodeType}
        sourceEntity={sourceEntity}
        teamEntityNodes={teamEntityNodes}
        handleToggle={handleToggle}
      />
      {
        selectedTeamNode && (
          <ResourcesButtonWithModal
            nodeId={nodeId}
            nodeType={nodeType}
            selectedTeamNode={selectedTeamNode}
          />
        )
      }
    </>
  )
}

ButtonGroup.propTypes = {
  sourceEntity: PropTypes.object,
  teamEntityNodes: PropTypes.object,
  handleToggle: PropTypes.func,
  resources: PropTypes.object,
  nodeType: PropTypes.string,
}

export default ButtonGroup
