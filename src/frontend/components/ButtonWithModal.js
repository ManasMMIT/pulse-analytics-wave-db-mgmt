import React from "react"
import PropTypes from "prop-types"

import Modal from "./Modal"

const ButtonWithModal = ({
  buttonStyle,
  buttonLabel,
  modalStyle,
  modalTitle,
  isModalOpen,
  closeModal,
  openModal,
  children
}) => (
  <button style={buttonStyle} onClick={openModal}>
    {buttonLabel}

    <Modal
      handleClose={closeModal}
      show={isModalOpen}
      title={modalTitle}
      style={modalStyle}
    >
      {children}
    </Modal>
  </button>
)

ButtonWithModal.propTypes = {
  buttonStyle: PropTypes.object,
  buttonLabel: PropTypes.node,
  modalStyle: PropTypes.object,
  modalTitle: PropTypes.node
}

ButtonWithModal.defaultProps = {
  buttonStyle: {},
  buttonLabel: "Click Me",
  modalStyle: {},
  modalTitle: null
}

export default ButtonWithModal
