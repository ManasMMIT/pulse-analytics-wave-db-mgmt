import React from 'react'
import PropTypes from 'prop-types'

import SitemapSwitch from './SitemapSwitch'
import ResourcesButtonWithModal from './ResourcesButtonWithModal'

const ButtonGroup = ({
  sourceEntity,
  handlers,
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
        handleToggle={handlers.handleToggle}
      />
      {
        selectedTeamNode && (
          <ResourcesButtonWithModal
            nodeId={nodeId}
            nodeType={nodeType}
            selectedTeamNode={selectedTeamNode}
            handlers={{
              handleRegBrkToggle: handlers.handleRegBrkToggle
            }}
          />
        )
      }
    </>
  )
}

ButtonGroup.propTypes = {
  sourceEntity: PropTypes.object,
  teamEntityNodes: PropTypes.object,
  handlers: PropTypes.object,
  resources: PropTypes.object,
  nodeType: PropTypes.string,
}

export default ButtonGroup
