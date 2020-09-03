import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import superUsersById from 'frontend/utils/super-users'
import { Colors } from 'frontend/utils/pulseStyles'

import SitemapSwitch from './SitemapSwitch'
import ResourcesButtonWithModal from './ResourcesButtonWithModal'

import { useAuth0 } from '../../../../../react-auth0-spa'

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StyledButtonLabel = styled.button({
  fontSize: 24,
  position: 'relative',
  top: 2,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  },
  color: transparentize(0.7, Colors.BLACK),
  ':hover': {
    color: Colors.PRIMARY,
    background: transparentize(0.9, Colors.PRIMARY),
  },
})

const copyToClipboard = (nodeId) => {
  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.writeText(nodeId)
    } else {
      console.log('permission DENIED')
    }
  })
}

const ButtonGroup = ({
  sourceEntity,
  handleToggle,
  nodeType,
  teamEntityNodes,
}) => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

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
      {isSuperUser && (
        <StyledButtonLabel onClick={() => copyToClipboard(nodeId)}>
          ⧉
        </StyledButtonLabel>
      )}
      {selectedTeamNode && (
        <ResourcesButtonWithModal
          nodeId={nodeId}
          nodeType={nodeType}
          selectedTeamNode={selectedTeamNode}
        />
      )}
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
