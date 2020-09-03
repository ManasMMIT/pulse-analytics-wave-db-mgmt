import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'

const SidebarLabel = styled.div(
  {
    padding: Spacing.S4,
    color: Color.GRAY_DARK,
    fontWeight: 700,
    borderRadius: 4,
    cursor: 'pointer',
    ...FontSpace.FS2,
    ':hover': {
      background: transparentize(0.9, Color.GRAY_DARK),
    },
  },
  ({ style }) => style
)

const defaultSelectedStyle = {
  background: transparentize(0.9, Color.BLUE),
  color: Color.BLUE,
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
  onClick: () => {},
}

export default SidebarItem
