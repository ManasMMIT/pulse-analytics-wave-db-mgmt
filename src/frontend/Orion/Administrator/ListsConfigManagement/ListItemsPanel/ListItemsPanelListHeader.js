import React from 'react'

import {
  ListHeader,
  ListTitle,
  StyledNavHeader,
  StyledButton,
} from '../shared/styledComponents'

const LIST_ITEMS_PANEL_LABEL = 'List Items / '
const CREATE_BUTTON_LABEL = '+'

const ListItemsPanelListHeader = ({ loading, title, handleClick }) => {
  const createButtonHandleClick = () => handleClick('newListItem')

  return (
    <ListHeader>
      <ListTitle>
        <span>{LIST_ITEMS_PANEL_LABEL}</span>
        <StyledNavHeader>{title}</StyledNavHeader>
      </ListTitle>
      <StyledButton
        onClick={createButtonHandleClick}
        disabled={!title || loading}
      >
        {CREATE_BUTTON_LABEL}
      </StyledButton>
    </ListHeader>
  )
}

export default ListItemsPanelListHeader
