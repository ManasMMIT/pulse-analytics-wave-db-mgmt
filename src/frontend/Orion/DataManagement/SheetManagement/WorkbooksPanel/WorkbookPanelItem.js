import React from 'react'

const WorkbookPanelItem = ({
  isSelected,
  handleClick,
  workbookName,
  children,
 }) => {
  return (
    <div style={{ display: 'flex' }}>
      <li 
        style={{ border: isSelected ? '1px solid red' : null }}
        onClick={handleClick}
        >
        {workbookName}
      </li>

      {children}
    </div>
  )
}

export default WorkbookPanelItem
