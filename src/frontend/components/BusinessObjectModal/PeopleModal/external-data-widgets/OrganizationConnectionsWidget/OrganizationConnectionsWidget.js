import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import ConnectionsList from './ConnectionsList'
import ConnectionsPanel from './ConnectionsPanel'

import Spinner from 'frontend/components/Spinner'

import {
  GET_ORGANIZATION_TYPES,
  GET_PERSON_ORGANIZATION_CONNECTIONS,
} from 'frontend/api/queries'

const WidgetContainer = styled.div({
  display: 'flex',
  width: '100%',
})

const OrganizationConnectionsWidget = ({ entity }) => {
  const { data: organizationTypeData, loading: orgTypeLoading } = useQuery(
    GET_ORGANIZATION_TYPES
  )
  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_PERSON_ORGANIZATION_CONNECTIONS,
    {
      variables: {
        personId: entity._id,
      },
    }
  )

  const [selectedOrganization, changeOrganization] = useState({})
  const [hasNewOrgConnection, setNewOrgConnectionStatus] = useState(false)

  useEffect(() => {
    if (!orgTypeLoading && !connectionsLoading) {
      const { personOrganizationConnections } = connectionsData
      changeOrganization(personOrganizationConnections[0])
    }
  }, [connectionsLoading, orgTypeLoading])

  if (orgTypeLoading || connectionsLoading) return <Spinner size={28} />

  const { personOrganizationConnections } = connectionsData
  const { organizationTypes } = organizationTypeData

  return (
    <WidgetContainer>
      <ConnectionsList
        hasNewOrgConnection={hasNewOrgConnection}
        setNewOrgConnectionStatus={setNewOrgConnectionStatus}
        personOrganizationConnections={personOrganizationConnections}
        organizationTypes={organizationTypes}
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
      />
      <ConnectionsPanel
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
        setNewOrgConnectionStatus={setNewOrgConnectionStatus}
        hasNewOrgConnection={hasNewOrgConnection}
        personOrganizationConnections={personOrganizationConnections}
      />
    </WidgetContainer>
  )
}

OrganizationConnectionsWidget.propTypes = {
  entity: PropTypes.object.isRequired,
}

export default OrganizationConnectionsWidget
