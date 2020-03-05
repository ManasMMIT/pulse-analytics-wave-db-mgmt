import React from 'react'

const SheetPanelItem = ({
  isSelected,
  handleClick,
  sheetName,
  children,
 }) => {
  return (
    <div style={{ display: 'flex' }}>
      <li 
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
      >
        {sheetName}
      </li>
      
      {children}
    </div>
  )
}

export default SheetPanelItem
