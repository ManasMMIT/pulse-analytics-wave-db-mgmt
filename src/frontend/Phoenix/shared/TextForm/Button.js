import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../../utils/pulseStyles'

import Modal from '../../../components/Modal'
import TextForm from './TextForm'

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
  state = {
    isModalOpen: false,
  }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render () {
    const {
      data,
      mutationDoc,
      buttonLabel,
      buttonStyle,
      buttonColor,
      modalTitle,
      modalStyle,
      clientMutation,
      additionalFormData,
      refetchQueries,
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
          style={modalStyle}
          handleClose={this.closeModal}
          show={this.state.isModalOpen}
          title={modalTitle}
        >
          <TextForm
            data={data}
            mutationDoc={mutationDoc}
            additionalFormData={additionalFormData}
            clientMutation={clientMutation}
            afterSubmitHook={this.closeModal}
            refetchQueries={refetchQueries}
          />
        </Modal>
      </>
    )
  }
}

Button.propTypes = {
  ...TextForm.propTypes,
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.string,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

Button.defaultProps = {
  ...TextForm.defaultProps,
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  buttonColor: Colors.PRIMARY,
  modalTitle: null,
  modalStyle: {},
}

export default Button
