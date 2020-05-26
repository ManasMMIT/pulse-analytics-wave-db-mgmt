import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from './Form'
import Modal from '../../../../../../components/Modal'

import { StyledButton } from '../../shared/styledComponents'

const ModalButtonWithForm = ({
  data,
  modalTitle,
  modalStyle,
  mutationDoc,
  mutationVars,
  afterMutationHook,
  buttonLabel,
  style,
  selectedBom,
}) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <StyledButton
        style={style}
        onClick={openModal}
      >
        {buttonLabel}
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
          closeModal={closeModal}
          mutationDoc={mutationDoc}
          mutationVars={mutationVars}
          afterMutationHook={afterMutationHook}
          selectedBom={selectedBom}
        />
      </Modal>
    </>
  )
}

ModalButtonWithForm.propTypes = {
  ...Form.propTypes,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

ModalButtonWithForm.defaultProps = {
  ...Form.defaultProps,
  modalTitle: null,
  modalStyle: {},
}

export default ModalButtonWithForm
