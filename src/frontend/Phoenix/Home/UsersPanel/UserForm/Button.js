import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../../components/Modal'
import UserForm from './UserFormContainer'

const defaultButtonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
}

class Button extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render() {
    const { isModalOpen } = this.state

    const {
      buttonLabel,
      buttonStyle,
      modalTitle,
      modalStyle,
      userId,
      username,
      email,
      selectedTeamId,
      mutationDoc,
    } = this.props

    return (
      <>
        <button
          style={{ ...defaultButtonStyle, ...buttonStyle }}
          onClick={this.openModal}
        >
          {buttonLabel}
        </button>

        <Modal
          title={modalTitle}
          style={modalStyle}
          handleClose={this.closeModal}
          show={isModalOpen}
        >
          <UserForm
            userId={userId}
            username={username}
            email={email}
            selectedTeamId={selectedTeamId}
            afterSubmitHook={this.closeModal}
            mutationDoc={mutationDoc}
          />
        </Modal>
      </>
    )
  }
}

Button.propTypes = {
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
  ...UserForm.propTypes,
}

Button.defaultProps = {
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  modalTitle: null,
  modalStyle: {},
  ...UserForm.defaultProps,
}


export default Button
