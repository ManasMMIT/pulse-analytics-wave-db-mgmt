import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'
import Modal from 'frontend/components/Modal'
import CreateModalContent from './CreateModalContent'

const CreateIcon = styled(FontAwesomeIcon)({
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

const CreateButton = styled.button({
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

const CreateSourceNodeButton = ({ type, isEnabled }) => {
  const [showModal, setShowModal] = useState(false)

  if (!isEnabled) return null

  const handleModalOpen = () => setShowModal(true)
  const handleModalClose = () => setShowModal(false)

  return (
    <>
      <CreateButton onClick={handleModalOpen}>
        <CreateIcon size="lg" icon={faPlus} />
      </CreateButton>
      <Modal disableHeader show={showModal} handleClose={handleModalClose}>
        <CreateModalContent type={type} handleModalClose={handleModalClose} />
      </Modal>
    </>
  )
}

export default CreateSourceNodeButton
