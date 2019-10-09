import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Modal from './../../components/Modal'
import Spinner from './Spinner'

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

const DeleteButton = ({
  mutationDoc,
  clientMutation,
  style,
  modalTitle,
  modalText,
  itemId,
  additionalFormData,
}) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const client = useApolloClient()

  const updateClientMutationCallback = (store, { data }) => client.mutate({
    mutation: clientMutation,
    variables: { data }
  })

  const [deleteHandler, { loading, error }] = useMutation(
    mutationDoc,
    { update: updateClientMutationCallback },
  )

  if (loading) return <Spinner />
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>

  const finalDeleteHandler = () => deleteHandler({
    variables: {
      input: {
        _id: itemId,
        ...additionalFormData
      }
    }
  }).then(closeModal)

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

        <div
          style={modalButtonStyle}
          onClick={finalDeleteHandler}
        >
          Delete Forever
        </div>
      </Modal>
    </>
  )
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  mutationDoc: PropTypes.object,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  itemId: PropTypes.string,
  clientMutation: PropTypes.object,
  client: PropTypes.object,
  additionalFormData: PropTypes.object,
}

export default DeleteButton
