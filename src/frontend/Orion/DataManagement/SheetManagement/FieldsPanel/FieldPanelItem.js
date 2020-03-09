import React from 'react'

const FieldPanelItem = ({
  isSelected,
  handleClick,
  fieldName,
  children,
 }) => {
  return (
    <li style={{ display: 'flex', padding: 8 }}>
      <div
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
      >
        {fieldName}
      </div>
      {children}
    </li>
  )
}

export default FieldPanelItem
