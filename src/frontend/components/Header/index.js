import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import FontSpace from '../../utils/fontspace'

const HeaderText = styled.div(
  {
    fontWeight: 700,
    ...FontSpace.FS6,
  },
  ({ headerStyle }) => headerStyle
)

const SubheaderText = styled.div(
  {
    ...FontSpace.FS2,
  },
  ({ subheaderStyle }) => subheaderStyle
)

const Header = ({ header, subheader, headerStyle, subheaderStyle, style }) => (
  <div style={style}>
    <HeaderText headerStyle={headerStyle}>{header}</HeaderText>
    {subheader && (
      <SubheaderText subheaderStyle={subheaderStyle}>{subheader}</SubheaderText>
    )}
  </div>
)

Header.propTypes = {
  header: PropTypes.node.isRequired,
  subheader: PropTypes.node,
  style: PropTypes.object,
  headerStyle: PropTypes.object,
  subheaderStyle: PropTypes.object,
}

Header.defaultProps = {
  subheader: '',
  style: {},
  headerStyle: {},
  subheaderStyle: {},
}

export default Header
