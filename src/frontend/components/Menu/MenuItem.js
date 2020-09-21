import React from 'react'
import PropTypes from 'prop-types'
import { transparentize } from 'polished'

import styled from '@emotion/styled'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const defaultStyle = {
  color: Color.BLACK,
  backgroundColor: Color.WHITE,
  ':hover': {
    color: Color.BLUE,
    cursor: 'pointer',
    backgroundColor: transparentize(0.9, Color.BLUE),
  },
}

const activeStyle = {
  color: Color.WHITE,
  backgroundColor: Color.BLUE,
}

const MenuItemWrapper = styled.li(
  {
    borderRadius: 4,
    padding: `${Spacing.S3} ${Spacing.S4}`,
    margin: `0px ${Spacing.S2}`,
    transition: 'all 0.1s ease',
    fontWeight: 500,
    ...FontSpace.FS2,
  },
  ({ isActive }) => ({
    ...(isActive ? activeStyle : defaultStyle),
  })
)

const MenuItem = ({ label, isActive, value, clickHandler }) => (
  <MenuItemWrapper isActive={isActive} onClick={() => clickHandler(value)}>
    {label}
  </MenuItemWrapper>
)

MenuItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  clickHandler: PropTypes.func,
  isActive: PropTypes.bool,
}

MenuItem.defaultProps = {
  label: '',
  value: null,
  clickHandler: () => {},
  isActive: false,
}

export default MenuItem
