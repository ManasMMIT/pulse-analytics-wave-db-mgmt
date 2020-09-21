import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'

const MenuContainer = styled.ul({
  background: Color.WHITE,
  borderRadius: 4,
  minWidth: 200,
  listStyleType: 'none',
})

const Menu = ({ style, children }) => {
  return <MenuContainer style={style}>{children}</MenuContainer>
}

Menu.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
}
Menu.defaultProps = {
  style: {},
  children: null,
}

export default Menu
