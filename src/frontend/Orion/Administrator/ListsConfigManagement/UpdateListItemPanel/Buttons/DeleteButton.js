import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Modal from 'frontend/components/Modal'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

const DELETE_MODAL_LABEL = 'Delete List Item',
  DELETE_BUTTON_LABEL = 'Delete'

const modalButtonStyle = {
  background: Colors.RED,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: 4,
  padding: Spacing.SMALL,
  textAlign: 'center',
}

const StyledButton = styled.button({
  border: 'none',
  borderRadius: 4,
  background: transparentize(0.85, Colors.RED),
  padding: '12px 12px 12px 12px',
  marginLeft: '25%',
  marginBottom: '-5%',
  color: Colors.RED,
  cursor: 'pointer',
  ':hover': {
    color: Colors.RED,
    background: transparentize(0.7, Colors.RED),
  },
})

const deleteButtonDivStyle = {
  alignItems: 'center',
}

const DeleteButton = ({ style, modalTitle, modalText, deleteFunc }) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const handleDelete = () => {
    deleteFunc()
    closeModal()
  }

  return (
    <>
      <div style={{ deleteButtonDivStyle }}>
        <StyledButton style={{ ...style }} onClick={openModal}>
          {DELETE_MODAL_LABEL}
        </StyledButton>
      </div>
      <Modal handleClose={closeModal} show={isModalOpen} title={modalTitle}>
        {modalText}
        <div style={modalButtonStyle} onClick={handleDelete}>
          {DELETE_BUTTON_LABEL}
        </div>
      </Modal>
    </>
  )
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  deleteFunc: PropTypes.func,
}

DeleteButton.defaultProps = {
  style: {},
  modalTitle: '',
  modalText: '',
  deleteFunc: () => {},
}

export default DeleteButton
