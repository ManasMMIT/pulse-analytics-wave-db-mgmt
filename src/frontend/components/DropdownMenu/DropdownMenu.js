import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'

import Color from 'frontend/utils/color'
import Button from 'frontend/components/Button'
import Menu from 'frontend/components/Menu'
import Icon from 'frontend/components/Icon'
import Spacing from 'frontend/utils/spacing'

import useOnClickOutside from 'frontend/hooks/useOnClickOutside'

const menuStyle = {
  boxShadow: '0 4px 12px 0 rgba(10,46,77,0.2)',
  marginTop: Spacing.S3,
  position: 'absolute',
}

const DropdownMenu = ({ style, buttonContent, children }) => {
  const [showMenu, toggleShowMenu] = useState(false)
  const handleClick = () => toggleShowMenu(!showMenu)
  const ref = useRef()
  useOnClickOutside(ref, () => toggleShowMenu(false))

  return (
    <div ref={ref}>
      <Button type={'secondary'} onClick={handleClick}>
        <Icon iconName="add" color1={Color.PRIMARY} width={16} />
      </Button>
      {showMenu && <Menu style={menuStyle}>{children}</Menu>}
    </div>
  )
}

DropdownMenu.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
}

DropdownMenu.defaultProps = {
  children: null,
  style: {},
}

export default DropdownMenu
