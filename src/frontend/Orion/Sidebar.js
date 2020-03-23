import React from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Dropdown from './shared/Dropdown'

import { Colors, Spacing } from '../utils/pulseStyles'

const OrionHeader = styled.div({
  alignItems: 'center',
  background: transparentize(0.3, Colors.BLACK),
  color: Colors.ORION,
  display: 'flex',
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.MEDIUM} ${Spacing.EXTRA_LARGE}`,
  textTransform: 'uppercase',
})

const OrionLogo = styled.img({
  display: 'inline',
  marginRight: Spacing.SMALL,
})

const Header = styled.div({
  padding: `${Spacing.LARGE} ${Spacing.EXTRA_LARGE} 0`,
  fontSize: 10,
  fontWeight: 500,
  color: transparentize(0.7, Colors.WHITE),
  textTransform: 'uppercase',
  letterSpacing: 0.6,
})

const Wrapper = styled.div({
  width: Spacing.TOOL_SIDEBAR,
  minWidth: Spacing.TOOL_SIDEBAR,
  backgroundColor: Colors.TOOL_SIDEBAR,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  height: '100vh',
})

const sharedStyles = {
  margin: `0 ${Spacing.NORMAL}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
}

const StyledNavLink = styled(NavLink)({
  ':hover': {
    background: transparentize(0.9, Colors.WHITE),
  },
})

const StyledDropdown = styled(Dropdown)({
  fontWeight: 500,
})

const inactiveLinkStyle = {
  color: transparentize(0.4, Colors.WHITE),
  ...sharedStyles,
}

const activeLinkStyle = {
  color: Colors.WHITE,
  background: transparentize(0.9, Colors.WHITE),
  ...sharedStyles,
}

const dropdownInactiveLinkStyle = {
  ...inactiveLinkStyle,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  display: 'block',
  cursor: 'pointer',
}

const dropdownActiveLinkStyle = {
  ...activeLinkStyle,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  display: 'block',
  cursor: 'pointer',
}

const ORDERED_MASTER_LIST_ITEMS = [
  'Treatment Plans',
  'Indications',
  'Regimens',
  'Products',
  'Manufacturers',
]

const getNavLink = label => (
  <StyledNavLink
    key={`nav-link:${label}`}
    style={inactiveLinkStyle}
    activeStyle={activeLinkStyle}
    to={`/orion/lists/${_.kebabCase(label)}`}
  >
    {label}
  </StyledNavLink>
)

const getToolItemPath = (tool, item) => {
  return `/orion/lists/tools/${tool}/${item}`
}

const linkConfig = [
  { label: 'Query Tool', link: '/orion/data-management/query' },
  { label: 'New Query Tool', link: '/orion/data-management/new-query' },
  { label: 'Suggested Questions', link: '/orion/data-management/questions' },
  {
    label: 'Sheet Management',
    link: '/orion/data-management/sheet-management',
  },
  { label: 'New Import Tool', link: '/orion/data-management/new-import' },
  { label: 'Old Import Tool', link: '/orion/data-management/import' },
  {
    label: 'Export Custom Data',
    link: '/orion/data-management/export-custom-data',
  },
  { label: 'Payer Projects', link: '/orion/data-management/payer-projects' },
  { label: 'Add Source Node', link: '/orion/data-management/add-source-node' },
  { label: 'Edit Role Node', link: '/orion/data-management/edit-role-node' },
]

const renderStyledNavLink = ({ label, link }) => (
  <StyledNavLink
    key={link}
    style={inactiveLinkStyle}
    activeStyle={activeLinkStyle}
    to={link}
  >
    {label}
  </StyledNavLink>
)

const Sidebar = () => {
  const masterListItems = ORDERED_MASTER_LIST_ITEMS.map(getNavLink)

  return (
    <Wrapper>
      <OrionHeader>
        <OrionLogo src="https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/orion-1-color.svg" />
        Orion DB
      </OrionHeader>
      <Header>Data Management</Header>
      {linkConfig.map(renderStyledNavLink)}
      <Header>MASTER LISTS</Header>
      {masterListItems}
      <div>
        <Header>TOOL MASTER LISTS</Header>
        <StyledDropdown
          style={inactiveLinkStyle}
          label={'Alternative Payment Models'}
        >
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('apm', 'accounts')}
          >
            Accounts
          </StyledNavLink>
        </StyledDropdown>
        <StyledDropdown style={inactiveLinkStyle} label={'Pathways'}>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('pathways', 'accounts')}
          >
            Accounts
          </StyledNavLink>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('pathways', 'newaccounts')}
          >
            New Pathways Accounts
          </StyledNavLink>
        </StyledDropdown>
        <StyledDropdown
          style={inactiveLinkStyle}
          label={'Payer Quality of Access'}
        >
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('payer', 'accounts')}
          >
            Accounts
          </StyledNavLink>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('payer', 'scores')}
          >
            Quality of Access Scores
          </StyledNavLink>
        </StyledDropdown>
        <StyledDropdown
          style={inactiveLinkStyle}
          label={'Provider Key Accounts'}
        >
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('provider', 'accounts')}
          >
            Accounts
          </StyledNavLink>
        </StyledDropdown>
      </div>
    </Wrapper>
  )
}

export default Sidebar
