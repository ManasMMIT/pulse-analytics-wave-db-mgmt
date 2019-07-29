import React from 'react'
import UserForm from '../../components/forms/UserForm'

import Modal from './../../components/Modal'

class UserFormButton extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  finalSubmitHandler = data => this.props.handleSubmit(data).then(this.closeModal)

  render() {
    const { isModalOpen } = this.state

    const {
      selectedTeam,
      selectedClient,
      teams,
    } = this.props

    return (
      <>
        <button
          onClick={this.openModal}
        >
          Create new user
        </button>
        <Modal
          handleClose={this.closeModal}
          show={isModalOpen}
        >
          <UserForm
            handleSubmit={this.finalSubmitHandler}
            selectedTeam={selectedTeam}
            selectedClient={selectedClient}
            teams={teams}
          />
        </Modal>
      </>
    )
  }
}

export default UserFormButton
