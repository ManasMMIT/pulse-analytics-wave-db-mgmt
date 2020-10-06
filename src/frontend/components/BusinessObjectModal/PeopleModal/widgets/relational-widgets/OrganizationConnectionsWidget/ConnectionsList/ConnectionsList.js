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
  const { organizationType, organization } = selectedOrganization

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

  const createOrgConnectionHandler = (value) => {
    const stagedNewOrg = {
      organization: `New ${organizationType} Organization Connection`,
      organizationType: value,
    }

    setWhetherNewOrgBeingCreated(true)
    changeOrganization(stagedNewOrg)
  }

  const groupedConnectionsByStatus = _.sortBy(
    Object.entries(_.groupBy(connectionsData, 'status')),
    ([status]) => status
  )

  console.log(groupedConnectionsByStatus)

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={'Organization Connections'}>
        <DropdownMenu>
          <MenuGroup menuGroupLabel={'New Organization Connection Type:'}>
            {organizationTypes.map((value) => (
              <MenuItem
                key={value}
                label={value}
                value={value}
                isDisabled={!ACTIVE_MENU_ITEMS.includes(value)}
                clickHandler={createOrgConnectionHandler}
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
  hasNewOrgConnection: PropTypes.bool.isRequired,
  organizationTypes: PropTypes.array.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  setNewOrgConnectionStatus: PropTypes.func.isRequired,
}

export default ConnectionsList
