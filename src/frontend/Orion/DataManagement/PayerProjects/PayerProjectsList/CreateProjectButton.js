import React, { useState } from 'react'
import styled from '@emotion/styled'

import Color from '../../../../utils/color'
import FontSpace from '../../../../utils/fontspace'
import Spacing from '../../../../utils/spacing'

import Modal from '../../../../components/Modal'
import Button from '../../../../components/Button'
import FieldLabel from '../../../../components/FieldLabel'
import Input from '../../../../components/Input'

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
  const [projectName, setProjectName] = useState('')

  const openModal = () => toggleModal(true)
  const closeModal = () => {
    setProjectName('')
    toggleModal(false)
  }
  
  const onChangeHandler = e => setProjectName(e.value)

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
            onClick={() => {}}
          >
            Create Project
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  )
}

export default CreateProjectButton
