import React from 'react'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'

const DashboardToolPanelItem = ({
  isSelected,
  handleClick,
  dashboardToolLabel,
}) => {
  const listItemHandleClick = isSelected ? () => {} : handleClick

  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
  }

  return (
    <ListItem onClick={listItemHandleClick} style={listItemActiveStyle}>
      <div>
        <div>{dashboardToolLabel}</div>
      </div>
    </ListItem>
  )
}

export default DashboardToolPanelItem
