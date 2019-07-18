import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import Modal from '../../Modal'

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
    // const {
    //   editHandler,
    //   item,
    // } = this.props

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
          ...
        </Modal>
        {/* // <EditFormModal item={item} editHandler={editHandler} /> */}
      </>
    );
  }
}

export default EditButton
