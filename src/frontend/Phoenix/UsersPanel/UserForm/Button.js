import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../components/Modal'
import UserForm from './UserForm'

class Button extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  finalSubmitHandler = data => this.props.handleSubmit(data).then(this.closeModal)

  render() {
    const { isModalOpen } = this.state

    const {
      buttonLabel,
      buttonStyle,
      modalTitle,
      modalStyle,
      userId,
      selectedClient,
      selectedTeam,
      username,
      email,
      allTeamsUserIsOn,
      teams,
    } = this.props

    return (
      <>
        <button style={buttonStyle} onClick={this.openModal}>
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
            selectedClient={selectedClient}
            selectedTeam={selectedTeam}
            username={username}
            email={email}
            allTeamsUserIsOn={allTeamsUserIsOn}
            handleSubmit={this.finalSubmitHandler}
            teams={teams}
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
