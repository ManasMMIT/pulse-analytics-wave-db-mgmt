import React from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../components/Modal'
import TextForm from './TextForm'

const defaultButtonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
}

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
      modalTitle,
      modalStyle,
      refetchQueryDoc,
      getInputFields,
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
          style={modalStyle}
          handleClose={this.closeModal}
          show={this.state.isModalOpen}
          title={modalTitle}
        >
          <TextForm
            data={data}
            mutationDoc={mutationDoc}
            refetchQueryDoc={refetchQueryDoc}
            afterSubmitHook={this.closeModal}
            getInputFields={getInputFields}
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
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

Button.defaultProps = {
  ...TextForm.defaultProps,
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  modalTitle: null,
  modalStyle: {},
}

export default Button
