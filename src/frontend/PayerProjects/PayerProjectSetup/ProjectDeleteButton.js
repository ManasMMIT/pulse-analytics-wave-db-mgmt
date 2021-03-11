import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import { useHistory, useParams } from 'react-router-dom'

import Button from 'frontend/components/Button'
import Modal from 'frontend/components/Modal'
import Spinner from 'frontend/components/Spinner'

import { Colors } from 'frontend/utils/pulseStyles'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import { DELETE_PAYER_PROJECT } from 'frontend/api/mutations/payerProjects'
import { GET_PAYER_PROJECTS_LIST } from 'frontend/api/queries'

const Confirmation = styled.p({
  ...FontSpace.FS3,
  marginBottom: Spacing.S4,
})

const ProjectDeleteButton = () => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)
  let history = useHistory()
  const { projectId } = useParams()

  const [handleDelete, { loading }] = useMutation(DELETE_PAYER_PROJECT, {
    variables: {
      input: {
        _id: projectId,
      },
    },
    refetchQueries: [
      {
        // To update Project List when redirecting to project list page
        query: GET_PAYER_PROJECTS_LIST,
      },
    ],
    onCompleted: () => history.push('/payer-projects'),
    onError: (e) => alert(`Write failure: ${e.message}`),
  })

  const buttonContent = loading ? (
    <Spinner />
  ) : (
    <Button onClick={handleDelete} type="secondary" color={Colors.RED}>
      Delete Project
    </Button>
  )

  return (
    <>
      <Button onClick={openModal} type="secondary" color={Colors.RED}>
        Delete Project
      </Button>
      <Modal
        handleClose={closeModal}
        show={isModalOpen}
        title={'Delete Project'}
        modalStyle={{ textAlign: 'right' }}
      >
        <Confirmation>
          Are you sure you want to delete this project?
        </Confirmation>
        {buttonContent}
      </Modal>
    </>
  )
}

export default ProjectDeleteButton
