import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from '../../Sidebar'
import SidebarItem from '../../Sidebar/SidebarItem'

const BomSidebar = ({ options, onClick, selectedTab, sidebarStyle }) => {
  if (!selectedTab.value) return null

  const sidebarItems = options.map(option => {
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

  return <Sidebar sidebarStyle={sidebarStyle}>{sidebarItems}</Sidebar>
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
  sidebarStyle: PropTypes.object,
}

BomSidebar.defaultProps = {
  sidebarStyle: {},
  onClick: () => null,
}

export default BomSidebar
