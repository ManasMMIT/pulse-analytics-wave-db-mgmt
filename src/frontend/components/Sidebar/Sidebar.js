import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Spacing from '../../utils/spacing'

const SidebarWrapper = styled.div(
  {
    width: 256,
    padding: Spacing.S4,
  },
  ({ width, sidebarStyle }) => ({
    width,
    ...sidebarStyle,
  })
)

const Sidebar = ({ children, width, sidebarStyle }) => {
  return (
    <SidebarWrapper width={width} sidebarStyle={sidebarStyle}>
      {children}
    </SidebarWrapper>
  )
}

Sidebar.propTypes = {
  children: PropTypes.any,
  width: PropTypes.number,
  sidebarStyle: PropTypes.object,
}

Sidebar.defaultProps = {
  sidebarStyle: {},
}

export default Sidebar
