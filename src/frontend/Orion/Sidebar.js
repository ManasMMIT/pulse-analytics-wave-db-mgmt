import React from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import styled from '@emotion/styled'

import Dropdown from './shared/Dropdown'

const Header = styled.div({
  padding: 24,
  fontSize: 18,
  fontWeight: 500,
  color: '#4b6b89',
})

const Wrapper = styled.div({
  width: 250,
  backgroundColor: 'rgb(10, 53, 87)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  height: '100vh',
})

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

const dropdownInactiveLinkStyle = {
  ...inactiveLinkStyle,
  padding: '12px 24px',
  display: 'block',
}

const dropdownActiveLinkStyle = {
  ...activeLinkStyle,
  padding: '12px 24px',
  display: 'block',
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

const getToolItemPath = (tool, item) => {
  return `/orion/lists/tools/${tool}/${item}`
}

const Sidebar = () => {
  const masterListItems = ORDERED_MASTER_LIST_ITEMS.map(getNavLink)

  return (
    <Wrapper>
      <Header>
        Data Management
      </Header>
      <NavLink
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
        to={`/orion/data-management/import`}
      >
        Import Excel Sheets
      </NavLink>
      <Header>
        MASTER LISTS
      </Header>
      {masterListItems}
      <div>
        <Header>
          TOOL MASTER LISTS
        </Header>
        <Dropdown
          style={inactiveLinkStyle}
          label={'Alternative Payment Models'}
        >
          <NavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('apm', 'accounts')}
          >
            Accounts
          </NavLink>
        </Dropdown>
        <Dropdown
          style={inactiveLinkStyle}
          label={'Pathways'}
        >
          <NavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('pathways', 'accounts')}
          >
            Accounts
          </NavLink>
        </Dropdown>
        <Dropdown
          style={inactiveLinkStyle}
          label={'Payer Quality of Access'}
        >
          <NavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('payer', 'accounts')}
          >
            Accounts
          </NavLink>
          <NavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('payer', 'scores')}
          >
            Quality of Access Scores
          </NavLink>
        </Dropdown>
        <Dropdown
          style={inactiveLinkStyle}
          label={'Provider Key Accounts'}
        >
          <NavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('provider', 'accounts')}
          >
            Accounts
          </NavLink>
        </Dropdown>
      </div>
    </Wrapper>
  )
}

export default Sidebar
