import React from 'react'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { NEW_LIST_ITEM } from '../utils'

import { ListItem } from '../shared/styledComponents'
import DragHandle from './DragHandle'

const ListItemPanelItem = ({
  isSelected,
  handleClick,
  listItemLabelKey,
  listItemLabelName,
  style,
  children,
}) => {
  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
    justifyContent: 'left',
    ...style,
  }
  const dragHandleSpanStyle = {
    width: 10,
  }
  const listItemLabelStyle = {
    marginLeft: 20,
  }
  const listItemSubFieldStyle = {
    fontSize: '10px',
  }

  return (
    <ListItem onClick={handleClick} style={listItemActiveStyle}>
      <span style={dragHandleSpanStyle}>
        {listItemLabelKey !== NEW_LIST_ITEM.labelKey && <DragHandle />}
      </span>
      <div style={listItemLabelStyle}>
        <div>{listItemLabelKey}</div>
        <div style={listItemSubFieldStyle}>{listItemLabelName}</div>
      </div>
      <div>{children}</div>
    </ListItem>
  )
}

export default ListItemPanelItem
