import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize, lighten } from 'polished'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import Modal from './../../components/Modal'
import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing, Transitions } from '../../utils/pulseStyles'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

const StyledButton = styled.button({
  border: 'none',
  background: 'none',
  color: transparentize(0.7, Colors.BLACK),
  cursor: 'pointer',
  margin: '0 6px',
  padding: '4px 6px',
  borderRadius: 4,
  ':hover': {
    color: Colors.RED,
    background: transparentize(0.85, Colors.RED),
  },
  ':active': {
    background: transparentize(0.75, Colors.RED),
  },
})

const DeleteForeverButton = styled.button({
  borderRadius: 4,
  border: 'none',
  background: Colors.RED,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: `background ${Transitions.NORMAL}`,
  ':hover': {
    background: lighten(0.1, Colors.RED),
  },
})

const modalButtonStyle = {}

const DeleteButton = ({
  mutationDoc,
  clientMutation, // TODO: Change var name; confusing because this has nothing to do with Client business object, refers to frontend resolver mutation doc
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

  const updateClientMutationCallback = (store, { data }) =>
    client.mutate({
      mutation: clientMutation,
      variables: { data },
    })

  const [deleteHandler, { loading, error }] = useMutation(mutationDoc, {
    update: updateClientMutationCallback,
  })

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>

  const finalDeleteHandler = () =>
    deleteHandler({
      variables: {
        input: {
          _id: itemId,
          ...additionalFormData,
        },
      },
    }).then(closeModal)

  return (
    <>
      <StyledButton style={{ ...style }} onClick={openModal}>
        {trashCan}
      </StyledButton>
      <Modal handleClose={closeModal} show={isModalOpen} title={modalTitle}>
        {modalText}
        {loading ? (
          <Spinner />
        ) : (
          <DeleteForeverButton
            style={modalButtonStyle}
            onClick={finalDeleteHandler}
          >
            Delete Forever
          </DeleteForeverButton>
        )}
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
