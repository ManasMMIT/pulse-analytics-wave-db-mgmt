import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import FontSpace from '../../utils/fontspace'

const HeaderText = styled.p(
  {
    fontWeight: 700,
    ...FontSpace.FS6,
  },
  ({ headerStyle }) => headerStyle
)

const SubheaderText = styled.p(
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
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string,
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
