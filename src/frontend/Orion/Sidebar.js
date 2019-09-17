import React from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'

const tabsContainerStyle = {
  width: 250,
  backgroundColor: 'rgb(10, 53, 87)',
}

const sharedStyles = {
  display: 'block',
  padding: 24,
  textDecoration: 'none',
  fontWeight: 600,
}

const inactiveLinkStyle = {
  color: 'rgb(122, 151, 177)',
  ...sharedStyles,
}

const activeLinkStyle = {
  color: 'rgb(235, 246, 251)',
  borderLeft: '4px solid rgb(15, 102, 208)',
  ...sharedStyles,
}

const sectionHeaderStyle = {
  padding: 24,
  fontSize: 18,
  fontWeight: 500,
  color: '#4b6b89',
}

const ORDERED_MASTER_LIST_ITEMS = [
  'Treatment Plans',
  'Indications',
  'Regimens',
  'Products',
  'Manufacturers'
]

const ORDERED_TOOL_MASTER_LIST_ITEMS = [
  'Payer Quality of Access',
  'Provider Key Accounts',
]

const getNavLink = label => (
    <NavLink
      key={`nav-link:${label}`}
      style={inactiveLinkStyle}
      activeStyle={activeLinkStyle}
      to={`/orion/${_.kebabCase(label)}`}
    >
      {label}
    </NavLink>
)

const Sidebar = () => {

  const masterListItems = ORDERED_MASTER_LIST_ITEMS.map(getNavLink)

  const toolMasterListItems = ORDERED_TOOL_MASTER_LIST_ITEMS.map(getNavLink)

  return (
    <div style={tabsContainerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={sectionHeaderStyle}>
          MASTER LISTS
        </div>
        {masterListItems}
        <div>
          <div style={sectionHeaderStyle}>
            TOOL MASTER LISTS
          </div>
          {toolMasterListItems}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
