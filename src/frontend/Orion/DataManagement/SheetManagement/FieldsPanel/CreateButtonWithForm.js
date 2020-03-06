import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from './Form'
import Modal from '../../../../components/Modal'

const CreateButtonWithForm = ({
  modalTitle,
  modalStyle,
  mutationDoc,
  mutationVars,
  afterMutationHook,
}) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <button onClick={openModal}>
        Create Field
      </button>
      <Modal
        style={modalStyle}
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
      >
        <Form
          closeModal={closeModal}
          mutationDoc={mutationDoc}
          mutationVars={mutationVars}
          afterMutationHook={afterMutationHook}
        />
      </Modal>
    </>
  )
}

CreateButtonWithForm.propTypes = {
  ...Form.propTypes,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

CreateButtonWithForm.defaultProps = {
  ...Form.defaultProps,
  modalTitle: null,
  modalStyle: {},
}

export default CreateButtonWithForm
