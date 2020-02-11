import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../../../utils/pulseStyles'

import Modal from '../../../../components/Modal'
import UserForm from './UserFormContainer'

const StyledButton = styled.button({
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  },
}, props => ({
  background: transparentize(0.85, props.buttonColor),
  color: props.buttonColor,
  ':hover': {
    background: transparentize(0.7, props.buttonColor),
  }
}))

class Button extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render() {
    const { isModalOpen } = this.state

    const {
      userData,
      buttonLabel,
      buttonStyle,
      buttonColor,
      modalTitle,
      modalStyle,
      selectedTeamId,
      mutationDoc,
      additionalFormData,
      clientMutation,
    } = this.props

    return (
      <>
        <StyledButton
          style={{ ...buttonStyle }}
          onClick={this.openModal}
          buttonColor={buttonColor}
        >
          {buttonLabel}
        </StyledButton>

        <Modal
          title={modalTitle}
          style={modalStyle}
          handleClose={this.closeModal}
          show={isModalOpen}
        >
          <UserForm
            userData={userData}
            selectedTeamId={selectedTeamId}
            afterSubmitHook={this.closeModal}
            mutationDoc={mutationDoc}
            additionalFormData={additionalFormData}
            clientMutation={clientMutation}
          />
        </Modal>
      </>
    )
  }
}

Button.propTypes = {
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.string,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
  ...UserForm.propTypes,
}

Button.defaultProps = {
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  buttonColor: Colors.PRIMARY,
  modalTitle: null,
  modalStyle: {},
  ...UserForm.defaultProps,
}

export default Button
