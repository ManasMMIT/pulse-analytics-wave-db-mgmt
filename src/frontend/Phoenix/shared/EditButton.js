import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Modal from './../../components/Modal'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const defaultButtonStyle = {
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
}

class EditButton extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render() {
    const {
      style,
      modalTitle,
      children,
    } = this.props

    return (
      <>
        <button
          style={{ ...defaultButtonStyle, ...style }}
          onClick={this.openModal}
        >
          {editIcon}
        </button>
        <Modal
          handleClose={this.closeModal}
          show={this.state.isModalOpen}
          title={modalTitle}
        >
          {children}
        </Modal>
      </>
    )
  }
}

EditButton.propTypes = {
  style: PropTypes.object,
  modalTitle: PropTypes.string,
};

EditButton.defaultProps = {
  style: {},
  modalTitle: null,
}

export default EditButton
