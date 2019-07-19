import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import Modal from '../../Modal'
import SimpleForm from './../../forms/SimpleForm'
import UserForm from './../../forms/UserForm'

class EditButton extends Component {
  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  formHandler = data => {
    this.props.editHandler(data)
    this.handleClose()
  }

  render() {
    const {
      data,
      formConfig: {
        formType,
        formTitle,
      }
    } = this.props

    const Form = formType !== 'user'
      ? SimpleForm
      : UserForm

    return (
      <>
        <span onClick={this.handleOpen}>
          <FontAwesomeIcon icon={faEdit} />
        </span>
        <Modal
          title={formTitle}
          show={this.state.open}
          handleClose={this.handleClose}
        >
          <Form editHandler={this.formHandler} data={data} />
        </Modal>
      </>
    );
  }
}

EditButton.defaultProps = {
  formConfig: {
    formType: 'simple',
    formTitle: 'Edit'
  }
};

export default EditButton
