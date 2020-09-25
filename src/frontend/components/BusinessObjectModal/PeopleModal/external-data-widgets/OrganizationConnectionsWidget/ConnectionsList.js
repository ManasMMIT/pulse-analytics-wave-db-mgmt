import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import styled from '@emotion/styled'

import SectionTitle from 'frontend/components/SectionTitle'
import DropdownMenu from 'frontend/components/DropdownMenu'

import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'

import { formatDateMonthYearLong } from 'frontend/utils/formatDate'

import List from 'frontend/components/List'
import Sublist from 'frontend/components/List/Sublist'
import SublistHeaderRow from 'frontend/components/List/SublistHeaderRow'
import Color from 'frontend/utils/color'
import ConnectionListItem from './ConnectionListItem'

const ConnectionsListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
})

const SUBLIST_MAP = {
  active: {
    rowColor: Color.GREEN,
    isDisabled: false,
    formatter: null,
  },
  excluded: {
    rowColor: Color.GRAY_DARK,
    isDisabled: true,
    formatter: null,
  },
  outdated: {
    rowColor: Color.GRAY_DARK,
    isDisabled: true,
    formatter: formatDateMonthYearLong,
  },
}

const ACTIVE_MENU_ITEMS = ['Pathways']

const generateSublist = ({
  groupedConnectionsByStatus,
  selectedOrganization,
  orgClickHandler,
}) => {
  return Object.keys(groupedConnectionsByStatus)
    .sort()
    .map((status) => {
      const currentData = groupedConnectionsByStatus[status]
      const { rowColor, formatter, isDisabled } = SUBLIST_MAP[status]

      return (
        <Sublist key={status}>
          <SublistHeaderRow
            text={`${status} (${currentData.length})`}
            rowColor={rowColor}
          />
          {currentData.map((datum) => {
            const {
              _id,
              organization,
              organizationType,
              description,
              position,
            } = datum
            // For Outdated date formatting
            const formattedDescription = formatter
              ? formatter(description)
              : description
            const isActive = selectedOrganization._id === _id

            return (
              <ConnectionListItem
                key={_id}
                organizationType={organizationType}
                title={organization}
                subtitle={position}
                description={formattedDescription}
                value={datum}
                isActive={isActive}
                clickHandler={orgClickHandler}
                isDisabled={isDisabled}
              />
            )
          })}
        </Sublist>
      )
    })
}

const ConnectionsList = ({
  changeOrganization,
  selectedOrganization,
  personOrganizationConnections,
  organizationTypes,
  hasNewOrgConnection,
  setNewOrgConnectionStatus,
}) => {
  const { organizationType, organization } = selectedOrganization
  const orgClickHandler = (value) => {
    if (hasNewOrgConnection) {
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

    setNewOrgConnectionStatus(true)
    changeOrganization(stagedNewOrg)
  }

  const groupedConnectionsByStatus = _.groupBy(
    personOrganizationConnections,
    'status'
  )

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
        {hasNewOrgConnection && (
          <ConnectionListItem title={organization} isActive={true} />
        )}
        {generateSublist({
          groupedConnectionsByStatus,
          selectedOrganization,
          orgClickHandler,
        })}
      </List>
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  changeOrganization: PropTypes.func.isRequired,
  hasNewOrgConnection: PropTypes.bool.isRequired,
  organizationTypes: PropTypes.array.isRequired,
  personOrganizationConnections: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  setNewOrgConnectionStatus: PropTypes.func.isRequired,
}

export default ConnectionsList
