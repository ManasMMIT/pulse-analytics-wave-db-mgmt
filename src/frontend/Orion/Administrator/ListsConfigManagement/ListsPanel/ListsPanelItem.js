import React from 'react'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'

const ListsPanelItem = ({
  listsConfigListId,
  listsConfigNodeId,
  listsConfigTitle,
  isSelected,
  handleClick,
  children,
}) => {
  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
  }

  const listItemSubField = {
    fontSize: '10px',
  }

  return (
    <ListItem onClick={handleClick} style={listItemActiveStyle}>
      <div>
        <div>{listsConfigListId}</div>
        <div style={listItemSubField}>{listsConfigNodeId}</div>
        <div style={listItemSubField}>{listsConfigTitle}</div>
      </div>
      <div>{children}</div>
    </ListItem>
  )
}

export default ListsPanelItem
