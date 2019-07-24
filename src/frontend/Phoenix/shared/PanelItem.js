import React from 'react'
import PropTypes from 'prop-types'

import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

const defaultStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

const PanelItem = ({
  item,
  text,
  style,
  editForm,
  handlers: {
    editHandler,
    deleteHandler,
    onClick,
  },
  // isSelected,
}) => {
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      onClick={() => onClick(item.id)}
    >
      <span>{text}</span>

      <span>
        {editHandler && (
          <EditButton>
            {editForm}
          </EditButton>
        )}

        <span>
          {deleteHandler && (
            <DeleteButton
              itemId={item.id}
              deleteHandler={deleteHandler}
            />
          )}
        </span>
      </span>
    </div>
  );
}

PanelItem.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  text: PropTypes.string,
  style: PropTypes.object,
  handlers: PropTypes.object,
  editForm: PropTypes.node,
}

PanelItem.defaultProps = {
  style: {
    cursor: "pointer",
    backgroundColor: "none",
    padding: 24,
    color: "#838c96",
    borderLeft: "4px solid transparent",
  }
}

export default PanelItem
