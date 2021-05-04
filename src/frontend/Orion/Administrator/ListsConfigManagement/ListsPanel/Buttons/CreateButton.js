import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'

import Form from './Form'
import Modal from 'frontend/components/Modal'

import { StyledButton } from '../../shared/styledComponents'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { CREATE_LISTS_CONFIG } from 'frontend/api/mutations'
import { getSelectedDashboardTool } from '../../utils'

const CreateButton = ({ handleClick, style }) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  const location = useLocation()

  const selectedDashboardTool = getSelectedDashboardTool(location)

  const { data: listsConfigData, loading } = useQuery(GET_LISTS_CONFIG, {
    variables: { dashboardTool: selectedDashboardTool },
  })

  const [createList] = useMutation(CREATE_LISTS_CONFIG, {
    onError: alert,
    update: (cache, { data: { createListsConfig } }) => {
      const newListsConfigData = listsConfigData.listsConfig
      let i = 0

      while (
        i < newListsConfigData.length &&
        newListsConfigData[i].listId < createListsConfig.listId
      ) {
        i++
      }
      newListsConfigData.splice(i, 0, createListsConfig)

      cache.writeQuery({
        query: GET_LISTS_CONFIG,
        data: { listsConfig: newListsConfigData },
        variables: { dashboardTool: selectedDashboardTool },
      })
    },
    onCompleted: ({ createListsConfig }) => {
      closeModal()
      handleClick(createListsConfig._id)
    },
  })

  return (
    <>
      <StyledButton onClick={openModal} style={style} disabled={loading}>
        +
      </StyledButton>
      <Modal
        style={{}}
        handleClose={closeModal}
        show={isModalOpen}
        title={'List Info'}
        width={500}
      >
        <Form mutationFunction={createList} closeModal={closeModal} />
      </Modal>
    </>
  )
}

CreateButton.propTypes = {
  ...Form.propTypes,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

CreateButton.defaultProps = {
  ...Form.defaultProps,
  modalTitle: null,
  modalStyle: {},
}

export default CreateButton
