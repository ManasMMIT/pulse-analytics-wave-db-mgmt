import React from 'react'
import UserForm from '../../components/forms/UserForm'
import ButtonWithModal from '../../components/ButtonWithModal'

class UserFormButton extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render() {
    const { isModalOpen } = this.state

    const {
      handleSubmit,
      selectedTeam,
      selectedClient,
      teams,
    } = this.props

    const finalSubmitHandler = data => handleSubmit(data).then(this.closeModal)

    return (
      <ButtonWithModal
        // buttonStyle={{ padding: 6 }} // TODO: css prop in reusable component doesn't work
        buttonLabel="Create new user"
        modalTitle="Create new user"
        isModalOpen={isModalOpen}
        closeModal={this.closeModal}
        openModal={this.openModal}
      >
        <UserForm
          handleSubmit={finalSubmitHandler}
          selectedTeam={selectedTeam}
          selectedClient={selectedClient}
          teams={teams}
        />
      </ButtonWithModal>
    )
  }
}

export default UserFormButton
