import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import Modal from './../../components/Modal'
import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing } from '../../utils/pulseStyles'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

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
  background: 'none',
  color: transparentize(0.7, Colors.BLACK),
  cursor: 'pointer',
  ':hover': {
    color: Colors.RED,
    background: transparentize(0.9, Colors.RED),
  },
})

const DeleteButton = (props) => {
  const {
    style,
    modalTitle,
    modalText,
    itemId,
    mutationDoc,
    refetchQueries,
    afterMutationHook,
  } = props

  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const [handleSubmit, { loading, error }] = useMutation(mutationDoc, {
    awaitRefetchQueries: true,
    refetchQueries,
    // the account modals don't need to pass closing the modal into afterMutationHook
    // because when refetchQueries are done, the account itself is no longer a list item
    // in the master list, meaning the list item completely unmounts and all of its children,
    // including its DeleteButton instantiation and the modal it wraps, also unmount
    update: afterMutationHook,
  })

  let buttonContent
  if (error) {
    buttonContent = <div style={{ color: 'red' }}>Error processing request</div>
  } else if (loading) {
    buttonContent = <Spinner />
  } else {
    buttonContent = (
      <div
        style={modalButtonStyle}
        onClick={() => handleSubmit({ variables: { input: { _id: itemId } } })}
      >
        Delete Forever
      </div>
    )
  }

  return (
    <>
      <StyledButton style={{ ...style }} onClick={openModal}>
        {trashCan}
      </StyledButton>
      <Modal handleClose={closeModal} show={isModalOpen} title={modalTitle}>
        {modalText}
        {buttonContent}
      </Modal>
    </>
  )
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  mutationDoc: PropTypes.object,
  refetchQueries: PropTypes.arrayOf(PropTypes.object),
  modalTitle: PropTypes.string,
  modalText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  itemId: PropTypes.string,
  afterMutationHook: PropTypes.func,
}

export default DeleteButton
