import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import Modal from 'frontend/components/Modal'
import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { getSelectedDashboardTool } from '../utils'

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
    mutationVars,
    mutationDoc,
    afterMutationHook,
  } = props

  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const location = useLocation()

  const selectedDashboardTool = getSelectedDashboardTool(location)

  const { data: listsConfigData } = useQuery(GET_LISTS_CONFIG, {
    variables: { input: { dashboardTool: selectedDashboardTool } },
  })

  const [handleSubmit, { loading, error }] = useMutation(mutationDoc, {
    onError: alert,
    update: (cache) => {
      const newListsConfigData = listsConfigData.listsConfig.filter(
        (listsConfig) => listsConfig._id !== mutationVars._id
      )

      cache.writeQuery({
        query: GET_LISTS_CONFIG,
        data: { listsConfig: newListsConfigData },
        variables: { input: { dashboardTool: selectedDashboardTool } },
      })
    },
    onCompleted: () => {
      closeModal()
      afterMutationHook()
    },
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
        onClick={() => handleSubmit({ variables: { input: mutationVars } })}
      >
        Delete
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
  mutationVars: PropTypes.object,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
}

export default DeleteButton
