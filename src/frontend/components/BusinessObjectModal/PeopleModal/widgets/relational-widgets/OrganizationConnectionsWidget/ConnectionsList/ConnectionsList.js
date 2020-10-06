import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import styled from '@emotion/styled'

import SectionTitle from 'frontend/components/SectionTitle'
import DropdownMenu from 'frontend/components/DropdownMenu'

import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'

import List from 'frontend/components/List'

import ConnectionListItem from './ConnectionListItem'
import ConnectionsSublist from './ConnectionsSublist'

const ConnectionsListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
})

const ACTIVE_MENU_ITEMS = ['Pathways']

const ConnectionsList = ({
  changeOrganization,
  selectedOrganization,
  connectionsData,
  organizationTypes,
  setWhetherNewOrgBeingCreated,
  isNewOrgBeingCreated,
}) => {
  const { organization } = selectedOrganization

  const orgClickHandler = (value) => {
    if (isNewOrgBeingCreated) {
      // Disable selection when a new organization connection is being created
      alert(
        'Selecting an existing connection is locked. Please save or cancel the new connection.'
      )
    } else {
      changeOrganization(value)
    }
  }

  const createOrgConnectionHandler = (orgType) => {
    const stagedNewOrg = {
      organization: `New ${orgType} Organization Connection`,
      organizationType: orgType,
    }

    setWhetherNewOrgBeingCreated(true)
    changeOrganization(stagedNewOrg)
  }

  const groupedConnectionsByStatus = _.sortBy(
    Object.entries(_.groupBy(connectionsData, 'status')),
    ([status]) => status
  )

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={'Organization Connections'}>
        <DropdownMenu>
          <MenuGroup menuGroupLabel={'New Organization Connection Type:'}>
            {organizationTypes.map((orgType) => (
              <MenuItem
                key={orgType}
                label={orgType}
                value={orgType}
                isDisabled={!ACTIVE_MENU_ITEMS.includes(orgType)}
                clickHandler={() => createOrgConnectionHandler(orgType)}
              />
            ))}
          </MenuGroup>
        </DropdownMenu>
      </SectionTitle>
      <List>
        {isNewOrgBeingCreated && (
          <ConnectionListItem title={organization} isActive />
        )}

        {groupedConnectionsByStatus.map(([status, data]) => (
          <ConnectionsSublist
            key={status}
            status={status}
            data={data}
            selectedOrganization={selectedOrganization}
            orgClickHandler={orgClickHandler}
          />
        ))}
      </List>
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  changeOrganization: PropTypes.func.isRequired,
  organizationTypes: PropTypes.array.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
  setWhetherNewOrgBeingCreated: PropTypes.func.isRequired,
}

export default ConnectionsList
