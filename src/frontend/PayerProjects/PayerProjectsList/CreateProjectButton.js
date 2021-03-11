import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'
import FieldLabel from 'frontend/components/FieldLabel'
import Input from 'frontend/components/Input'
import {
  CREATE_PAYER_PROJECT,
} from 'frontend/api/mutations'
import {
  GET_PAYER_PROJECTS_LIST,
} from 'frontend/api/queries'

const modalStyle = {
  width: 400,
  padding: Spacing.S7,
  background: Color.LIGHT_BLUE_GRAY_1,
}

const Header = styled.div({
  marginBottom: Spacing.S7,
  fontWeight: 500,
  ...FontSpace.FS4,
})

const ButtonWrapper = styled.div({
  display: 'flex',
  marginTop: Spacing.S7,
})

const CreateProjectButton = () => {
  const [isModalOpen, toggleModal] = useState(false)

  // TODO: Managing the form's state shouldn't be the button's job; 
  // rather, it should be the form's job, and the form should clear itself
  // when it unmounts, rather than the button clearing the state for the form
  const [projectName, setProjectName] = useState('')

  const openModal = () => toggleModal(true)
  const closeModal = () => {
    setProjectName('')
    toggleModal(false)
  }

  const onChangeHandler = e => setProjectName(e.value)

  const [submit] = useMutation(
    CREATE_PAYER_PROJECT,
    {
      variables: {
        input: {
          name: projectName,
        }
      },
      refetchQueries: [{ query: GET_PAYER_PROJECTS_LIST }],
      onCompleted: closeModal,
    },
  )

  return (
    <>
      <Button
        onClick={openModal}
        iconName="add"
        iconPosition="right"
        iconColor1={Color.WHITE}
      >
        Create Project
      </Button>
      <Modal
        show={isModalOpen}
        handleClose={closeModal}
        modalStyle={modalStyle}
        disableHeader
      >
        <Header>
          Create a Project
        </Header>
        <FieldLabel
          labelStyle={{ fontWeight: 500 }}
        >
          Project Name
        </FieldLabel>
        <Input
          name="project-name"
          type="text"
          value={projectName}
          onChange={onChangeHandler}
        />
        <ButtonWrapper>
          <Button
            type="secondary"
            onClick={closeModal}
            buttonStyle={{ marginRight: Spacing.S7 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={submit}
          >
            Create Project
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  )
}

export default CreateProjectButton
