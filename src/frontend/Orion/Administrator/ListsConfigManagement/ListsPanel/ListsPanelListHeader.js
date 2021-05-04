import React from 'react'

import { ListHeader, ListTitle } from './../shared/styledComponents'

import { CreateButton } from './Buttons'

const LISTS_PANEL_LABEL = 'Lists'

const ListsPanelListHeader = ({ handleClick }) => {
  return (
    <ListHeader>
      <ListTitle>{LISTS_PANEL_LABEL}</ListTitle>
      <CreateButton handleClick={handleClick} />
    </ListHeader>
  )
}

export default ListsPanelListHeader
