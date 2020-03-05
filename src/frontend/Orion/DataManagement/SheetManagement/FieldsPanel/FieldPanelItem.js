import React from 'react'

const FieldPanelItem = ({
  isSelected,
  handleClick,
  fieldName,
  children,
 }) => {
  return (
    <div style={{ display: 'flex' }}>
      <li 
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
      >
        {fieldName}
      </li>
      {children}
    </div>
  )
}

export default FieldPanelItem
