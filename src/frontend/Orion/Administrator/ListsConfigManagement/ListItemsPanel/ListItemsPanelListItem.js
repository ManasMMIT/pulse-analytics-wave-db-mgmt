import React from 'react'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { NEW_LIST_ITEM } from '../utils'

import { ListItem } from '../shared/styledComponents'
import DragHandle from './DragHandle'

const ListItemPanelItem = ({
  data,
  isSelected,
  handleClick,
  searchParamKey,
}) => {
  const listItemHandleClick = isSelected
    ? () => null
    : () => handleClick(data[searchParamKey])

  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
    justifyContent: 'left',
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
    <ListItem onClick={listItemHandleClick} style={listItemActiveStyle}>
      <span style={dragHandleSpanStyle}>
        {data.labelKey !== NEW_LIST_ITEM.labelKey && <DragHandle />}
      </span>
      <div style={listItemLabelStyle}>
        <div>{data.labelKey}</div>
        <div style={listItemSubFieldStyle}>{data.labelName}</div>
      </div>
    </ListItem>
  )
}

export default ListItemPanelItem
