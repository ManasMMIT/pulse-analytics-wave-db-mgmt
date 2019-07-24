import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import ButtonWithModal from './../../components/ButtonWithModal'

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
      <ButtonWithModal
        buttonLabel={editIcon}
        buttonStyle={{ ...style, ...defaultButtonStyle }}
        modalTitle={modalTitle}
        openModal={this.openModal}
        closeModal={this.closeModal}
        isModalOpen={this.state.isModalOpen}
      >
        { children }
      </ButtonWithModal>
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
