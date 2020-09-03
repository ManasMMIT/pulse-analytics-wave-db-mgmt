import React from 'react'
import PropTypes from 'prop-types'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'

import Sidebar from '../../Sidebar'
import SidebarItem from '../../Sidebar/SidebarItem'

const sidebarStyle = {
  borderRight: `2px solid ${transparentize(0.9, Color.BLACK)}`,
}

const BomSidebar = ({ options, onClick, selectedTab }) => {
  if (!selectedTab.value) return null

  const sidebarItems = options.map((option) => {
    const isSelected = option.value === selectedTab.value
    return (
      <SidebarItem
        key={option.value}
        option={option}
        isSelected={isSelected}
        onClick={onClick}
      />
    )
  })

  return (
    <Sidebar width={300} sidebarStyle={sidebarStyle}>
      {sidebarItems}
    </Sidebar>
  )
}

BomSidebar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  selectedTab: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
}

BomSidebar.defaultProps = {
  onClick: () => null,
}

export default BomSidebar
