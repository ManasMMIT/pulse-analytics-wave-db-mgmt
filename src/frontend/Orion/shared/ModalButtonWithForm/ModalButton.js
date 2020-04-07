import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Modal from '../../../components/Modal'
import Form from './Form'

import { transparentize } from 'polished'
import { Colors } from '../../../utils/pulseStyles'

const StyledButton = styled.button({
  background: 'none',
  border: 'none',
  borderRadius: 4,
  padding: '8px 12px',
  color: transparentize(0.7, Colors.BLACK),
  cursor: 'pointer',
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    background: transparentize(0.9, Colors.PRIMARY),
    color: Colors.PRIMARY,
  },
  ':focus': {
    outline: 'none',
  }
}, ({ children, ...props }) => ({ ...props })) // not sure why children is here // ? also doesn't this allow onClick through even though it's not styling related?

class Button extends React.Component {
  state = {
    isModalOpen: false,
  }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  render () {
    const {
      data,
      formStyle,
      mutationDoc,
      buttonLabel,
      buttonStyle,
      modalTitle,
      modalStyle,
      refetchQueries,
      getInputFields,
      afterMutationHook,
    } = this.props

    return (
      <>
        <StyledButton
          {...buttonStyle}
          onClick={this.openModal}
        >
          {buttonLabel}
        </StyledButton>
        <Modal
          modalStyle={modalStyle}
          handleClose={this.closeModal}
          show={this.state.isModalOpen}
          title={modalTitle}
        >
          <Form
            style={formStyle}
            data={data}
            mutationDoc={mutationDoc}
            refetchQueries={refetchQueries}
            afterSubmitHook={this.closeModal}
            afterMutationHook={afterMutationHook}
            getInputFields={getInputFields}
          />
        </Modal>
      </>
    )
  }
}

Button.propTypes = {
  ...Form.propTypes,
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

Button.defaultProps = {
  ...Form.defaultProps,
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  modalTitle: null,
  modalStyle: {},
}

export default Button
