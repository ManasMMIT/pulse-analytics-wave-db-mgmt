import React from 'react'
import { transparentize } from 'polished'

import { Colors } from '../../../../utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'

const PanelItem = ({ isSelected, handleClick, bomLabel, children }) => {
  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
  }

  return (
    <ListItem onClick={handleClick} style={listItemActiveStyle}>
      <div>{bomLabel}</div>
      <div>{children}</div>
    </ListItem>
  )
}

export default PanelItem
