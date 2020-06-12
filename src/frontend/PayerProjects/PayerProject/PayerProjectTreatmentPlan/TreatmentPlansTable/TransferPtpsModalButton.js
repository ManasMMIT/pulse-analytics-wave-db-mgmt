import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Select from 'react-select'
import {lighten, darken } from 'polished'

import {
  GET_PAYER_PROJECTS_LIST,
  GET_PAYER_PROJECT_PTPS
} from 'frontend/api/queries'
import {
  TRANSFER_PAYER_PROJECT_PTPS,
} from 'frontend/api/mutations'
import Modal from 'frontend/components/Modal'
import SubmitButton from 'frontend/components/SubmitButton'

import { Colors } from 'frontend/utils/pulseStyles'

// ! TODO: to be replaced with reusable button component
const PlaceholderButton = styled.button({
  margin: 12,
  padding: '8px 12px',
  color: 'white',
  fontWeight: 700,
  backgroundColor: Colors.BLUE,
  borderRadius: 4,
  fontSize: 12,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: lighten(0.1, Colors.BLUE),
  },
  ':active': {
    backgroundColor: darken(0.1, Colors.BLUE),
  }
})

const MODAL_TITLE = 'Transfer PTP Ownership'

const TransferPtpsModalButton = ({
  ptpIds,
}) => {
  const { projectId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // TODO: Managing the form's state shouldn't be the button's job;
  // rather, it should be the form's job, and the form should clear itself
  // when it unmounts, rather than the button clearing the state for the form
  const [selectedProject, setSelectedProject] = useState({})
  const { data, loading } = useQuery(GET_PAYER_PROJECTS_LIST)

  const closeModal = () => {
    setSelectedProject({})
    setIsModalOpen(false)
  }
  const openModal = () => setIsModalOpen(true)

  const [transferPtps] = useMutation(
    TRANSFER_PAYER_PROJECT_PTPS,
    {
      variables: {
        input: {
          projectId: selectedProject.value,
          orgTpIds: ptpIds,
        }
      },
      refetchQueries: [{ query: GET_PAYER_PROJECT_PTPS, variables: { input: { projectId } } }],
      onCompleted: closeModal,
      awaitRefetchQueries: true,
    }
  )

  if (loading) return null

  const dropdownOptions = data.payerProjectsList
    .map(({ _id, name }) => ({ value: _id, label: name }))

  return (
    <>
      <PlaceholderButton onClick={openModal}>
        Transfer PTP Ownership
      </PlaceholderButton>
      <Modal
        handleClose={closeModal}
        show={isModalOpen}
        title={MODAL_TITLE}
        width={500}
        modalStyle={{ height: 500 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
          <Select
            value={selectedProject}
            onChange={setSelectedProject}
            options={dropdownOptions}
          />
          <SubmitButton onClick={transferPtps}>
            Transfer Ownership
          </SubmitButton>
        </div>
      </Modal>
    </>
  )
}

export default TransferPtpsModalButton
