import React from 'react'
import PropTypes from 'prop-types'

import SitemapSwitch from './SitemapSwitch'
import ResourcesButtonWithModal from './ResourcesButtonWithModal'

const ButtonGroup = ({
  sourceEntity,
  teamEntityNodes,
  handlers,
  resources,
  nodeType,
}) => {
  const nodeId = sourceEntity._id
  const doesTeamHaveNode = Boolean(teamEntityNodes[nodeId])

  return (
    <>
      <SitemapSwitch
        sourceEntity={sourceEntity}
        teamEntityNodes={teamEntityNodes}
        handleToggle={handlers.handleToggle}
      />
      {
        resources.regionalBreakdown && doesTeamHaveNode && (
          <ResourcesButtonWithModal
            nodeId={nodeId}
            nodeType={nodeType}
            teamEntityNodes={teamEntityNodes}
            resources={{
              regionalBreakdown: resources.regionalBreakdown
            }}
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
