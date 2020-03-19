import React from 'react'

import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const FilterMenu = ({
  anchorEl,
  isMenuOpen,
  options,
  onClickAway,
}) => {
  const content = options.map(({ label, onClick }) => (
    <MenuItem onClick={onClick}>
      { label }
    </MenuItem>
  ))

  return (
    <Popper
      open={isMenuOpen}
      anchorEl={anchorEl}
      placement={'bottom-start'}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <Paper>
          <MenuList>
            { content }
          </MenuList>
        </Paper>
      </ClickAwayListener>
    </Popper>
  )
}

export default FilterMenu