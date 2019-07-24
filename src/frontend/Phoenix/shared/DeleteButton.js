import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import ButtonWithModal from './../../components/ButtonWithModal'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

const modalButtonStyle = {
  background: 'red',
  color: 'white',
  fontWeight: 700,
  padding: '4px 8px',
}

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
}

class DeleteButton extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  finalDeleteHandler = id => {
    this.props.deleteHandler(id).then(this.closeModal)
  }

  render() {
    const {
      style,
      modalTitle,
      modalText,
      itemId,
    } = this.props

    return (
      <ButtonWithModal
        buttonLabel={trashCan}
        buttonStyle={{ ...buttonStyle, ...style }}
        modalTitle={modalTitle}
        openModal={this.openModal}
        closeModal={this.closeModal}
        isModalOpen={this.state.isModalOpen}
      >
        {modalText}
        <button
          style={modalButtonStyle}
          onClick={() => this.finalDeleteHandler(itemId)}
        >
          Delete Forever
        </button>
      </ButtonWithModal>
    )
  }
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  deleteHandler: PropTypes.func,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  itemId: PropTypes.string,
};

export default DeleteButton
