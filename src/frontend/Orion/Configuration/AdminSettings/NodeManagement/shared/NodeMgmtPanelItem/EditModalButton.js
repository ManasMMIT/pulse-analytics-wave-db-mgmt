import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'
import Modal from 'frontend/components/Modal'

import EditModalContent from './EditModalContent'

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
  },
})

const EditModalButton = ({ node }) => {
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <EditButton onClick={() => setShowModal(true)}>
        <EditIcon size="lg" icon={faEdit} />
      </EditButton>
      <Modal disableHeader show={showModal}>
        <EditModalContent node={node} handleModalClose={handleModalClose} />
      </Modal>
    </>
  )
}

export default EditModalButton
