import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import _ from 'lodash'

import styled from '@emotion/styled'

import SectionTitle from 'frontend/components/SectionTitle'
import DropdownMenu from 'frontend/components/DropdownMenu'
import Spinner from 'frontend/components/Spinner'

import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'

import { formatDateMonthYearLong } from 'frontend/utils/formatDate'

import {
  GET_ORGANIZATION_TYPES,
  GET_PERSON_ORGANIZATION_CONNECTIONS,
} from 'frontend/api/queries'
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

const generateSublist = ({
  groupedConnectionsByStatus,
  selectedOrgConnection,
  changeOrgConnectionHandler,
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
          {currentData.map(
            ({
              _id,
              organization,
              organizationType,
              description,
              position,
            }) => {
              // For Outdated date formatting
              const formattedDescription = formatter
                ? formatter(description)
                : description
              return (
                <ConnectionListItem
                  key={_id}
                  organizationType={organizationType}
                  title={organization}
                  subtitle={position}
                  description={formattedDescription}
                  value={_id}
                  isActive={selectedOrgConnection === _id}
                  clickHandler={changeOrgConnectionHandler}
                  isDisabled={isDisabled}
                />
              )
            }
          )}
        </Sublist>
      )
    })
}

const ConnectionsList = ({ changeOrgType, selectedOrgType, personId }) => {
  const { data: organizationTypeData, loading: orgTypeLoading } = useQuery(
    GET_ORGANIZATION_TYPES
  )
  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_PERSON_ORGANIZATION_CONNECTIONS,
    {
      variables: { personId },
    }
  )
  const [selectedOrgConnection, changeOrgConnection] = useState(null)

  const createOrgConnectionHandler = (value) => changeOrgType(value)
  const changeOrgConnectionHandler = (value) => changeOrgConnection(value)

  if (orgTypeLoading || connectionsLoading) return <Spinner size={28} />

  const groupedConnectionsByStatus = _.groupBy(
    connectionsData.personOrganizationConnections,
    'status'
  )

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={'Organization Connections'}>
        <DropdownMenu>
          <MenuGroup menuGroupLabel={'New Organization Connection Type:'}>
            {organizationTypeData.organizationTypes.map((value) => (
              <MenuItem
                key={value}
                label={value}
                value={value}
                clickHandler={createOrgConnectionHandler}
              />
            ))}
          </MenuGroup>
        </DropdownMenu>
      </SectionTitle>
      <List>
        {generateSublist({
          groupedConnectionsByStatus,
          selectedOrgConnection,
          changeOrgConnectionHandler,
        })}
      </List>
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  changeOrgType: PropTypes.func.isRequired,
  selectedOrgType: PropTypes.string,
}

ConnectionsList.defaultProps = {
  selectedOrgType: null,
}

export default ConnectionsList
