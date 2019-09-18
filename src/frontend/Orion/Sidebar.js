import React from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'

import Dropdown from './shared/Dropdown'

const tabsContainerStyle = {
  width: 250,
  backgroundColor: 'rgb(10, 53, 87)',
}

const sharedStyles = {
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

const getNavLink = label => (
    <NavLink
      key={`nav-link:${label}`}
      style={inactiveLinkStyle}
      activeStyle={activeLinkStyle}
      to={`/orion/lists/${_.kebabCase(label)}`}
    >
      {label}
    </NavLink>
)

const Sidebar = () => {
  const masterListItems = ORDERED_MASTER_LIST_ITEMS.map(getNavLink)

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
          <Dropdown
            style={inactiveLinkStyle}
            label={'Alternative Payment Models'}
          >
            <NavLink
              style={{ ...inactiveLinkStyle, padding: '12px 24px', display: 'block' }}
              activeStyle={{ ...activeLinkStyle, padding: '12px 24px', display: 'block' }}
              to={'/orion/tools/apm/accounts'}
            >
              Accounts
            </NavLink>
          </Dropdown>
          <Dropdown
            style={inactiveLinkStyle}
            label={'Pathways'}
          >
            <NavLink
              style={{ ...inactiveLinkStyle, padding: '12px 24px', display: 'block' }}
              activeStyle={{ ...activeLinkStyle, padding: '12px 24px', display: 'block' }}
              to={'/orion/tools/pathways/accounts'}
            >
              Accounts
            </NavLink>
          </Dropdown>
          <Dropdown
            style={inactiveLinkStyle}
            label={'Payer Quality of Access'}
          >
            <NavLink
              style={{ ...inactiveLinkStyle, padding: '12px 24px', display: 'block' }}
              activeStyle={{ ...activeLinkStyle, padding: '12px 24px', display: 'block' }}
              to={'/orion/tools/payer/accounts'}
            >
              Accounts
            </NavLink>
            <NavLink
              style={{ ...inactiveLinkStyle, padding: '12px 24px', display: 'block' }}
              activeStyle={{ ...activeLinkStyle, padding: '12px 24px', display: 'block' }}
              to={'/orion/tools/payer/scores'}
            >
              Quality of Access Scores
            </NavLink>
          </Dropdown>
          <Dropdown
            style={inactiveLinkStyle}
            label={'Provider Key Accounts'}
          >
            <NavLink
              style={{ ...inactiveLinkStyle, padding: '12px 24px', display: 'block' }}
              activeStyle={{ ...activeLinkStyle, padding: '12px 24px', display: 'block' }}
              to={'/orion/tools/provider/accounts'}
            >
              Accounts
            </NavLink>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
