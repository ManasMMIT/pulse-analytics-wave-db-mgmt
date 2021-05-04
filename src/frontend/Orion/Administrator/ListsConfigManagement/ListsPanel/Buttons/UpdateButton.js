import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { UPDATE_LISTS_CONFIG } from 'frontend/api/mutations'

import Modal from 'frontend/components/Modal'

import { getSelectedDashboardTool } from '../../utils'

import { StyledButton } from '../../shared/styledComponents'
import Form from './Form'

const BUTTON_LABEL = 'Edit'

const UpdateButton = ({ data, modalTitle, modalStyle, style }) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const location = useLocation()

  const selectedDashboardTool = getSelectedDashboardTool(location)

  const { data: listsConfigData } = useQuery(GET_LISTS_CONFIG, {
    variables: { dashboardTool: selectedDashboardTool },
  })

  const [updateList] = useMutation(UPDATE_LISTS_CONFIG, {
    update: (cache, { data: { updateListsConfig } }) => {
      const newListsConfigData = listsConfigData.listsConfig.filter(
        (listsConfig) => listsConfig._id !== updateListsConfig._id
      )
      let i = 0

      while (
        i < newListsConfigData.length &&
        newListsConfigData[i].listId < updateListsConfig.listId
      ) {
        i++
      }
      newListsConfigData.splice(i, 0, updateListsConfig)

      cache.writeQuery({
        query: GET_LISTS_CONFIG,
        data: { listsConfig: newListsConfigData },
        variables: { dashboardTool: selectedDashboardTool },
      })
    },
    onCompleted: closeModal,
    onError: alert,
  })

  return (
    <>
      <StyledButton onClick={openModal} style={style}>
        {BUTTON_LABEL}
      </StyledButton>
      <Modal
        style={modalStyle}
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
        width={500}
      >
        <Form
          data={data}
          mutationFunction={updateList}
          closeModal={closeModal}
        />
      </Modal>
    </>
  )
}

UpdateButton.propTypes = {
  ...Form.propTypes,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

UpdateButton.defaultProps = {
  ...Form.defaultProps,
  modalTitle: null,
  modalStyle: {},
}

export default UpdateButton
