import React from 'react'
import PropTypes from 'prop-types'

import ButtonWithModal from './../../components/ButtonWithModal'
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

  render () {
    const {
      data,
      handleSubmit,
      buttonLabel,
      buttonStyle,
      modalTitle,
      modalStyle,
    } = this.props

    const finalHandleSubmit = data => {
      handleSubmit(data).then(this.closeModal)
    }

    return (
      <ButtonWithModal
        isModalOpen={this.state.isModalOpen}
        closeModal={this.closeModal}
        openModal={this.openModal}
        buttonStyle={{ ...buttonStyle, ...defaultButtonStyle }}
        buttonLabel={buttonLabel}
        modalTitle={modalTitle}
        modalStyle={modalStyle}
      >
        <TextForm data={data} handleSubmit={finalHandleSubmit} />
      </ButtonWithModal>
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
