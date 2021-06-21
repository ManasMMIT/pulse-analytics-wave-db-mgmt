import React from 'react'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import { ListItem } from '../shared/styledComponents'
import { UpdateButton, DeleteButton } from './Buttons'

const getDeleteModalText = (listsConfig) => {
  const nodeIdString = listsConfig.nodeId ? `, ${listsConfig.nodeId}` : ``
  const listTitleString = listsConfig.listTitle
    ? `, ${listsConfig.listTitle}`
    : ``
  return `You are about to delete ${
    listsConfig.listId + nodeIdString + listTitleString
  }. Are you sure?`
}

const ListsPanelItem = ({
  data,
  isSelected,
  handleClick,
  searchParamKey,
  children,
}) => {
  const listItemHandleClick = isSelected
    ? () => null
    : () => handleClick(data[searchParamKey])

  const listItemActiveStyle = {
    background: isSelected ? transparentize(0.9, Colors.PRIMARY) : null,
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    fontWeight: isSelected ? 700 : 500,
  }

  const listItemSubField = {
    fontSize: '10px',
  }

  return (
    <ListItem onClick={listItemHandleClick} style={listItemActiveStyle}>
      <div>
        <div>{data.listId}</div>
        <div style={listItemSubField}>{data.nodeId}</div>
        <div style={listItemSubField}>{data.listTitle}</div>
      </div>
      <div>
        <UpdateButton
          data={data}
          modalTitle="List Info"
          style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
        />
        <DeleteButton
          data={data}
          modalTitle={'Delete List'}
          modalText={getDeleteModalText(data)}
        />
      </div>
    </ListItem>
  )
}

export default ListsPanelItem
