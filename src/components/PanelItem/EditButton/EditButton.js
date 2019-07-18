import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import Modal from '../../Modal'
// import SimpleForm from './../../forms/SimpleForm'
// import UserForm from './../../forms/UserForm'

class EditButton extends Component {
  state = {
    open: false,
  }

  handleOpen = e => {
    e.stopPropagation()
    this.setState({ open: true })
  }

  handleClose = e => {
    e.stopPropagation()
    this.setState({ open: false })
  }

  render() {
    const {
      editHandler,
      data,
      // formType,
    } = this.props
    // const Form = formType !== 'user'
    //   ? SimpleForm
    //   : UserForm

    return (
      <>
        <span onClick={this.handleOpen}>
          <FontAwesomeIcon icon={faEdit} />
        </span>
        <Modal
          title={'a title'}
          show={this.state.open}
          handleClose={this.handleClose}
        >
          <Form
            editHandler={editHandler}
            data={data}
          />
        </Modal>
      </>
    );
  }
}

export default EditButton
