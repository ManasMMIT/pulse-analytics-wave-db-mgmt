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

const ORG_TYPE_TO_FORM_GENERATOR_MAP = {
  Pathways: (personId) => ({
    personId,
    organization: `New Pathways Organization Connection`,
    organizationType: 'Pathways',
    indicationIds: [],
    pathwaysInfluencerTypes: [],
    tumorTypeSpecialty: '',
    internalFields: {
      internalNotes: '',
      totalDisclosures: '',
      dateDisclosure1: '',
      dateDisclosure2: '',
      dateDisclosure3: '',
      dateDisclosure4: '',
      pathwaysManagementTypes: [],
      valueChairsIndicationIds: [],
    },
    position: '',
    priority: null,
    alert: {
      date: null,
      type: null,
      description: '',
    },
    exclusionSettings: {
      isExcluded: false, // default to true or false?
      reason: '',
    },
    startDate: null,
    endDate: null,
  }),
}

const ConnectionsList = ({
  personId,
  changeOrganization,
  selectedOrganization,
  connectionsData,
  organizationTypes,
  setWhetherNewOrgBeingCreated,
  isNewOrgBeingCreated,
  anyUnsavedChanges,
}) => {
  const { organization } = selectedOrganization

  const orgClickHandler = (value) => {
    if (anyUnsavedChanges || isNewOrgBeingCreated) {
      // Disable selection whenever edits are in progress
      alert(
        "You have unsaved changes! First save or cancel the connection you're on."
      )
    } else {
      changeOrganization(value)
    }
  }

  const createOrgConnectionHandler = (orgType) => {
    if (anyUnsavedChanges) {
      alert(
        "You have unsaved changes! Please save or cancel the connection you're on."
      )
    } else {
      const stagedNewOrg = ORG_TYPE_TO_FORM_GENERATOR_MAP[orgType](personId)
      setWhetherNewOrgBeingCreated(true)
      changeOrganization(stagedNewOrg)
    }
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
  personId: PropTypes.string.isRequired,
  changeOrganization: PropTypes.func.isRequired,
  organizationTypes: PropTypes.array.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
  setWhetherNewOrgBeingCreated: PropTypes.func.isRequired,
}

export default ConnectionsList
