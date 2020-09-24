import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const MenuGroupLabel = styled.h1({
  color: Color.BLACK,
  fontWeight: 700,
  padding: `${Spacing.S3} ${Spacing.S4}`,
  margin: `0 ${Spacing.S2}`,
  ...FontSpace.FS2,
})

const MenuGroupContainer = styled.ul({
  padding: `0 ${Spacing.S3}`,
  listStyleType: 'none',
})

const MenuGroup = ({
  style,
  menuGroupLabel,
  menuGroupLabelStyle,
  children,
}) => {
  return (
    <div style={style}>
      <MenuGroupLabel menuGroupLabelStyle={menuGroupLabelStyle}>
        {menuGroupLabel}
      </MenuGroupLabel>
      <MenuGroupContainer>{children}</MenuGroupContainer>
    </div>
  )
}

MenuGroup.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  menuGroupLabelStyle: PropTypes.object,
  menuGroupLabel: PropTypes.string,
}
MenuGroup.defaultProps = {
  style: {},
  children: null,
  menuGroupLabelStyle: {},
  menuGroupLabel: '',
}

export default MenuGroup
