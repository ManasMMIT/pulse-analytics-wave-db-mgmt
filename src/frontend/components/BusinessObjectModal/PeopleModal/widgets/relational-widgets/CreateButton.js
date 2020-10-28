import React from 'react'

import DropdownMenu from 'frontend/components/DropdownMenu'
import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'

const ACTIVE_MENU_ITEMS = ['Pathways']

const CreateButton = ({ organizationTypes, clickHandler }) => (
  <DropdownMenu>
    <MenuGroup menuGroupLabel={'New Organization Connection Type:'}>
      {organizationTypes.map((orgType) => (
        <MenuItem
          key={orgType}
          label={orgType}
          value={orgType}
          isDisabled={!ACTIVE_MENU_ITEMS.includes(orgType)}
          clickHandler={clickHandler}
        />
      ))}
    </MenuGroup>
  </DropdownMenu>
)

export default CreateButton
