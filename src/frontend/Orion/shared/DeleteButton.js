import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Modal from './../../components/Modal'
import Spinner from '../../Phoenix/shared/Spinner'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

const modalButtonStyle = {
  background: 'red',
  color: 'white',
  fontWeight: 700,
  padding: '4px 8px',
  textAlign: 'center',
}

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
  cursor: 'pointer',
}

const DeleteButton = props => {
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

  const [handleSubmit, { loading, error }] = useMutation(
    mutationDoc,
    {
      refetchQueries,
      update: afterMutationHook,
    }
  )

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
      <button
        style={{ ...buttonStyle, ...style }}
        onClick={openModal}
      >
        {trashCan}
      </button>
      <Modal
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
      >
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
  modalText: PropTypes.string,
  itemId: PropTypes.string,
  afterMutationHook: PropTypes.func,
};

export default DeleteButton
