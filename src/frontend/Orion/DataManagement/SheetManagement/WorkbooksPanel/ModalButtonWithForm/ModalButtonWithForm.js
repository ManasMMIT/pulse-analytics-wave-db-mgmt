import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from './Form'
import Modal from '../../../../../components/Modal'

const ModalButtonWithForm = ({
  data,
  modalTitle,
  modalStyle,
  mutationDoc,
  afterMutationHook,
  buttonLabel,
}) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <button onClick={openModal}>
        {buttonLabel}
      </button>
      <Modal
        style={modalStyle}
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
      >
        <Form
          data={data}
          closeModal={closeModal}
          mutationDoc={mutationDoc}
          afterMutationHook={afterMutationHook}
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
