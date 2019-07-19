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
  handlers,
  formConfig,
  isSelected,
}) => {
  const {
    deleteHandler,
    editHandler,
    onClick,
  } = handlers
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      onClick={() => onClick(item.id)}
    >
      <span>{text}</span>
      <span>
        {editHandler && (
          <EditButton
            data={item}
            formConfig={formConfig}
            editHandler={editHandler}
          />
        )}
        <span style={{ marginLeft: 12 }}>
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

PanelItem.defaultProps = {
  style: {
    cursor: "pointer",
    backgroundColor: "none",
    padding: 24,
    color: "#838c96",
    borderLeft: "4px solid transparent",
  }
}

PanelItem.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  text: PropTypes.string,
  style: PropTypes.object,
  handlers: PropTypes.object,
}

export default PanelItem
