import React from 'react'

const WorkbookPanelItem = ({
  isSelected,
  handleClick,
  workbookName,
  children,
 }) => {
  return (
    <li style={{ display: 'flex', padding: 8 }}>
      <div 
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
        >
        {workbookName}
      </div>

      {children}
    </li>
  )
}

export default WorkbookPanelItem
