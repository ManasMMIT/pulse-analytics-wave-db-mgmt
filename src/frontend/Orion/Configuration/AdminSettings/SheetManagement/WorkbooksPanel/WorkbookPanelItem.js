import React from 'react'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'

const WorkbookPanelItem = ({
  isSelected,
  handleClick,
  workbookName,
  children,
 }) => {
   const listItemActiveStyle = {
     background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
     color: isSelected ? Colors.PRIMARY : Colors.BLACK,
     fontWeight: isSelected ? 700 : 500,
   }

  return (
    <ListItem onClick={handleClick} style={listItemActiveStyle}>
      <div>
        {workbookName}
      </div>
      <div>
        {children}
      </div>
    </ListItem>
  )
}

export default WorkbookPanelItem
