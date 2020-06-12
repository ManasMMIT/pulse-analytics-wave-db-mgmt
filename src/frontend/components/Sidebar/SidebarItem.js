import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'
import { AlphaColors } from '../../utils/pulseStyles'

const SidebarLabel = styled.div(
  {
    padding: Spacing.S4,
    color: AlphaColors.Black70,
    fontWeight: 500,
    borderRadius: 4,
    cursor: 'pointer',
    ...FontSpace.FS2,
  },
  ({ style }) => style
)

const defaultSelectedStyle = {
  background: Color.LIGHT_BLUE_GRAY_1,
  color: Color.BLUE,
  borderRadius: 4,
  fontWeight: 700,
}

const SidebarItem = ({
  option,
  itemStyle,
  inactiveStyle,
  selectedStyle,
  isSelected,
  onClick,
}) => {
  const combinedInactiveItemStyle = { ...itemStyle, ...inactiveStyle }
  const combinedActiveStyle = {
    ...defaultSelectedStyle,
    ...itemStyle,
    ...selectedStyle,
  }

  const style = isSelected ? combinedActiveStyle : combinedInactiveItemStyle

  return (
    <SidebarLabel onClick={() => onClick(option)} style={style}>
      {option.label}
    </SidebarLabel>
  )
}

SidebarItem.propTypes = {
  option: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  itemStyle: PropTypes.object,
  isSelected: PropTypes.bool,
  inactiveStyle: PropTypes.object,
  selectedStyle: PropTypes.object,
}

SidebarItem.defaultProps = {
  itemStyle: {},
  isSelected: false,
  selectedStyle: {},
  inactiveStyle: {},
  onClick: () => {}
}

export default SidebarItem
