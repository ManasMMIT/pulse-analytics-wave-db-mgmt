import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import SitemapSwitch from './SitemapSwitch'
import ResourcesButtonWithModal from './ResourcesButtonWithModal'

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const ButtonGroup = ({
  sourceEntity,
  handleToggle,
  nodeType,
  teamEntityNodes,
}) => {
  const nodeId = sourceEntity._id
  const selectedTeamNode = teamEntityNodes[nodeId]

  return (
    <Container>
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
    </Container>
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
