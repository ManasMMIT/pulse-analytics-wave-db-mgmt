import React from 'react'
import { transparentize } from 'polished'

import { Colors } from '../../../../../utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'

const BusinessObjectsPanelItem = ({
  isSelected,
  handleClick,
  businessObjectName,
  children,
}) => {
  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
  }

  return (
    <ListItem onClick={handleClick} style={listItemActiveStyle}>
      <div>{businessObjectName}</div>
      <div>{children}</div>
    </ListItem>
  )
}

export default BusinessObjectsPanelItem
