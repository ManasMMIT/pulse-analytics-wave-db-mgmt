import React from 'react'
import PropTypes from 'prop-types'

import Modal from './../../components/Modal'
import TextForm from './../../components/forms/TextForm'

const defaultButtonStyle = {
  border: "none",
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
}

class TextFormButton extends React.Component {
  state = {
    isModalOpen: false,
  }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  finalHandleSubmit = data => {
    this.props.handleSubmit(data).then(this.closeModal)
  }

  render () {
    const {
      data,
      buttonLabel,
      buttonStyle,
      modalTitle,
      modalStyle,
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
            handleSubmit={this.finalHandleSubmit}
          />
        </Modal>
      </>
    )
  }
}

TextFormButton.propTypes = {
  data: PropTypes.object,
  handleSubmit: PropTypes.func,
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

TextFormButton.defaultProps = {
  data: { name: '' },
  handleSubmit: () => { console.log('submit action triggered') },
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  modalTitle: null,
  modalStyle: {},
}

export default TextFormButton
