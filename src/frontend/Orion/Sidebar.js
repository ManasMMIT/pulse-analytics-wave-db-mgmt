import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Dropdown from './shared/Dropdown'

import { useAuth0 } from '../../react-auth0-spa'
import superUsersById from '../utils/super-users'
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
  overflowY: 'auto',
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

const getToolItemPath = (tool, item) => {
  return `/orion/organizations/${tool}/${item}`
}

const QUERY_LINKS_CONFIG = [
  { label: 'Query Tool', link: '/orion/query/tool' },
  { label: 'Query Tool Demo', link: '/orion/query/tool-demo' },
  { label: 'Suggested Questions', link: '/orion/query/questions' },
]

const EXCEL_LINKS_CONFIG = [
  { label: 'Import Sheets', link: '/orion/excel/import-sheets' },
  {
    label: 'Export Custom Data',
    link: '/orion/excel/export-custom-data',
  },
]

const PRODUCT_INDICATION_LINKS_CONFIG = [
  {
    label: 'Phoenix Treatment Plans',
    link: '/orion/configuration/products-indications/phoenix-treatment-plans',
  },
  {
    label: 'Treatment Plans',
    link: '/orion/configuration/products-indications/treatment-plans',
  },
  {
    label: 'Indications',
    link: '/orion/configuration/products-indications/indications',
  },
  {
    label: 'Regimens',
    link: '/orion/configuration/products-indications/regimens',
  },
  {
    label: 'Products',
    link: '/orion/configuration/products-indications/products',
  },
  {
    label: 'Coverage Types',
    link: '/orion/configuration/products-indications/coverage-types',
  },
  {
    label: 'Subtypes',
    link: '/orion/configuration/products-indications/subtypes',
  },
  {
    label: 'Lines',
    link: '/orion/configuration/products-indications/lines',
  },
]

const ADMIN_SETTINGS_LINKS_CONFIG = [
  {
    label: 'Sheet Management',
    link: '/orion/configuration/admin-settings/sheet-management',
  },
  {
    label: 'Business Object Management',
    link: '/orion/configuration/admin-settings/bo-management',
  },
  {
    label: 'Business Object Modal Management',
    link: '/orion/configuration/admin-settings/bom-management',
  },
  {
    label: 'Query Tool Management',
    link: '/orion/configuration/admin-settings/aquila-management',
  },
  {
    label: 'Add Source Node',
    link: '/orion/configuration/admin-settings/add-source-node',
  },
  {
    label: 'Edit Role Node',
    link: '/orion/configuration/admin-settings/edit-role-node',
  },
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
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <Wrapper>
      <OrionHeader>
        <OrionLogo src="https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/orion-1-color.svg" />
        Orion DB
      </OrionHeader>
      <Header>Excel</Header>
      {EXCEL_LINKS_CONFIG.map(renderStyledNavLink)}
      <Header>Query</Header>
      {QUERY_LINKS_CONFIG.map(renderStyledNavLink)}
      <div>
        <Header>Organizations</Header>
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
        <StyledDropdown
          style={inactiveLinkStyle}
          label={'Oncology Benefit Managers'}
        >
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('obm', 'account-overview')}
          >
            Account Overview
          </StyledNavLink>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('obm', 'services')}
          >
            Services
          </StyledNavLink>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('obm', 'influencers')}
          >
            Influencers
          </StyledNavLink>
          <StyledNavLink
            style={dropdownInactiveLinkStyle}
            activeStyle={dropdownActiveLinkStyle}
            to={getToolItemPath('obm', 'payer-partnerships')}
          >
            Payer Partnerships
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
            to={getToolItemPath('payer', 'book-of-business')}
          >
            Book of Business
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
      <div>
        <Header>Configuration</Header>
        <StyledNavLink
          style={dropdownInactiveLinkStyle}
          activeStyle={dropdownActiveLinkStyle}
          to={'/orion/configuration/people'}
        >
          People
        </StyledNavLink>
        <StyledDropdown
          style={inactiveLinkStyle}
          label={'Products + Indications'}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PRODUCT_INDICATION_LINKS_CONFIG.map(renderStyledNavLink)}
          </div>
        </StyledDropdown>
        {isSuperUser && (
          <StyledDropdown style={inactiveLinkStyle} label={'Admin Settings'}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ADMIN_SETTINGS_LINKS_CONFIG.map(renderStyledNavLink)}
            </div>
          </StyledDropdown>
        )}
      </div>
    </Wrapper>
  )
}

export default Sidebar
