import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Modal from './../../components/Modal'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

const modalButtonStyle = {
  background: 'red',
  color: 'white',
  fontWeight: 700,
  padding: '4px 8px',
  textAlign: 'center',
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
      openModal,
      closeModal,
      state: { isModalOpen },
      props: {
        style,
        modalTitle,
        modalText,
        itemId,
      },
    } = this

    return (
      <>
        <button
          style={{ ...buttonStyle, ...style }}
          onClick={openModal}
        >
          {trashCan}
        </button>
        <Modal
          handleClose={closeModal}
          show={isModalOpen}
          title={modalTitle}
        >
          {modalText}
          <div
            style={modalButtonStyle}
            onClick={() => this.finalDeleteHandler(itemId)}
          >
            Delete Forever
          </div>
        </Modal>
      </>
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
