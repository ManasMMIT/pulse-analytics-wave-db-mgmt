import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../utils/pulseStyles'

import { useAuth0 } from '../../react-auth0-spa'
import superUsersById from '../utils/super-users'
import {
  DATA_IMPORT_CONFIG,
  ORGANIZATIONS_CONFIG,
  GENERAL_DATA_CONFIG,
  ADMINISTRATOR_DATA_CONFIG,
  EXPERIMENTAL_DATA_CONFIG,
  SPECIALIZED_DATA_CONFIG,
} from './sidebar-link-utils'
import NavigationLinks from '../components/NavigationLinks'

const SidebarContainer = styled.div({
  width: Spacing.TOOL_SIDEBAR,
  minWidth: Spacing.TOOL_SIDEBAR,
  backgroundColor: Colors.TOOL_SIDEBAR,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
})

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

const Sidebar = () => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <SidebarContainer>
      <OrionHeader>
        <OrionLogo src="https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/orion-1-color.svg" />
        Orion DB
      </OrionHeader>
      <div style={{ padding: `${Spacing.NORMAL} 0` }}>
        <NavigationLinks
          sectionHeader="Import/Export Data"
          linkConfig={DATA_IMPORT_CONFIG}
        />
        <NavigationLinks
          sectionHeader="Organizations"
          linkConfig={ORGANIZATIONS_CONFIG}
        />
        <NavigationLinks
          sectionHeader="General Data"
          linkConfig={GENERAL_DATA_CONFIG}
        />
        <NavigationLinks
          sectionHeader="Specialized Data"
          linkConfig={SPECIALIZED_DATA_CONFIG}
        />
        {isSuperUser && (
          <NavigationLinks
            sectionHeader="Administrator"
            linkConfig={ADMINISTRATOR_DATA_CONFIG}
          />
        )}
        <NavigationLinks
          sectionHeader="Experimental"
          linkConfig={EXPERIMENTAL_DATA_CONFIG}
        />
      </div>
    </SidebarContainer>
  )
}

export default Sidebar
