import React from 'react'

const SheetPanelItem = ({
  isSelected,
  handleClick,
  sheetName,
  children,
 }) => {
  return (
    <li style={{ display: 'flex', padding: 8 }}>
      <div
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
      >
        {sheetName}
      </div>
      
      {children}
    </li>
  )
}

export default SheetPanelItem
