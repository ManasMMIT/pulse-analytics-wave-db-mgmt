import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'

import SectionTitle from 'frontend/components/SectionTitle'
import DropdownMenu from 'frontend/components/DropdownMenu'
import Spinner from 'frontend/components/Spinner'

import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'

import { GET_ORGANIZATION_TYPES } from 'frontend/api/queries'

const ConnectionsListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
})

const ConnectionsList = ({ changeOrgType, selectedOrgType }) => {
  const { data, loading } = useQuery(GET_ORGANIZATION_TYPES)
  const clickHandler = (value) => {
    changeOrgType(value)
  }

  if (loading) {
    return <Spinner size={28} />
  }

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={'Organization Connections'}>
        <DropdownMenu>
          <MenuGroup menuGroupLabel={'New Organization Connection Type:'}>
            {data.organizationTypes.map((value) => (
              <MenuItem
                key={value}
                label={value}
                value={value}
                clickHandler={clickHandler}
              />
            ))}
          </MenuGroup>
        </DropdownMenu>
      </SectionTitle>
      Placeholder: {selectedOrgType} Selected
      {
        // TODO: Populate Organization Connections
      }
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  changeOrgType: PropTypes.func.isRequired,
  selectedOrgType: PropTypes.string.isRequired,
}

export default ConnectionsList
