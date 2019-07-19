import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

const DeleteButton = ({
  style,
  deleteHandler,
  itemId,
}) => {
  return (
    <span
      style={style}
      onClick={() => deleteHandler(itemId)}
    >
      <FontAwesomeIcon icon={faTrashAlt} />
    </span>
  )
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  deleteHandler: PropTypes.func,
  text: PropTypes.string
};

export default DeleteButton
