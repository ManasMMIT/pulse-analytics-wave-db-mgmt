import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'

import Form from './Form'
import Modal from '../../../../../components/Modal'

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

const EditButton = ({
  data,
  buttonLabel,
  buttonStyle,
  buttonColor,
  modalTitle,
  modalStyle,
}) => {
  const [isModalOpen, toggleModal] = useState(false)
  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <StyledButton
        style={{ ...buttonStyle }}
        onClick={openModal}
        buttonColor={buttonColor}
      >
        {buttonLabel}
      </StyledButton>
      <Modal
        style={modalStyle}
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
      >
        <Form 
          data={data} 
          closeModal={closeModal}
        />
      </Modal>
    </>
  )
}

EditButton.propTypes = {
  buttonLabel: PropTypes.node,
  buttonStyle: PropTypes.object,
  buttonColor: PropTypes.string,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

EditButton.defaultProps = {
  buttonLabel: <div>click to open</div>,
  buttonStyle: {},
  buttonColor: Colors.PRIMARY,
  modalTitle: null,
  modalStyle: {},
}

export default EditButton
