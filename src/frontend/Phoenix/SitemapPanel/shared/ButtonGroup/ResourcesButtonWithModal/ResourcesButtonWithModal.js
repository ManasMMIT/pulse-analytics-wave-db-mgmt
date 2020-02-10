import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import ResourcesModal from './ResourcesModal'

import { Colors } from '../../../../../utils/pulseStyles'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  background: 'none',
  padding: 12,
  cursor: 'pointer',
  borderRadius: 4,
  color: transparentize(0.7, Colors.BLACK),
  ':hover': {
    color: Colors.PRIMARY,
    background: transparentize(0.9, Colors.PRIMARY),
  },
})

const EditButton = styled.button({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  }
})

const ResourcesButtonWithModal = ({
  nodeId,
  nodeType,
  selectedTeamNode,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <EditButton
        onClick={() => setIsOpen(true)}
      >
        <EditIcon
          size="lg"
          icon={faEdit}
        />
      </EditButton>
      <ResourcesModal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        nodeId={nodeId}
        nodeType={nodeType}
        selectedTeamNode={selectedTeamNode}
      />
    </>
  )
}

ResourcesButtonWithModal.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  selectedTeamNode: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
}

export default ResourcesButtonWithModal
