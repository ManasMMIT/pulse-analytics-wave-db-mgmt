import React from 'react'
import styled from '@emotion/styled'

import ModalContent from './ModalContent'
import Modal from '../../../../../../components/Modal'
import Title from '../../../../../../components/Title'

import Color from '../../../../../../utils/color'
import FontSpace from '../../../../../../utils/fontspace'

const MODAL_TITLE = "PROJECT CONTENT CONFIGURATION"
const TITLE_MODIFIERS = ["Payer + Treatment Plan Section"]

const modalStyle = {
  width: '90%'
}

const Subtitle = styled.div({
  color: Color.BLACK,
  fontWeight: 500,
  ...FontSpace.FS2, 
})

const ProjectContentConfigurationModal = ({ projectId, isModalOpen, closeModal }) => {
  return (
    <Modal
      show={isModalOpen}
      handleClose={closeModal}
      modalStyle={modalStyle}
      disableHeader
    >
      <Title
        size="FS3"
        title={MODAL_TITLE}
        titleModifiers={TITLE_MODIFIERS}
        titleStyle={{ padding: 0 }}
      />
      <Subtitle>
        To create a Treatment Plan, select a Payer followed by an Indication. Once selected, click the toggle to add to your preferred Treatment Plan.
      </Subtitle>
      <ModalContent projectId={projectId} />
    </Modal>
  )
}

export default ProjectContentConfigurationModal