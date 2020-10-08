import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import ConnectionsList from './ConnectionsList'
import ConnectionPanel from './ConnectionPanel'

import usePathwaysPersonConnections from 'frontend/hooks/usePathwaysPersonConnections'
import Spinner from 'frontend/components/Spinner'

import { GET_ORGANIZATION_TYPES } from 'frontend/api/queries'

const WidgetContainer = styled.div({
  display: 'flex',
  width: '100%',
})

const OrganizationConnectionsWidget = ({ entity }) => {
  const { data: organizationTypeData, loading: orgTypeLoading } = useQuery(
    GET_ORGANIZATION_TYPES
  )

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = usePathwaysPersonConnections({
    personId: entity._id,
  })

  const [selectedOrganization, changeOrganization] = useState({})
  const [isNewOrgBeingCreated, setWhetherNewOrgBeingCreated] = useState(false)

  useEffect(() => {
    if (!orgTypeLoading && !connectionsLoading && connectionsData.length) {
      changeOrganization(connectionsData[0])
    }
  }, [connectionsLoading, orgTypeLoading])

  if (orgTypeLoading || connectionsLoading) return <Spinner size={28} />

  const { organizationTypes } = organizationTypeData

  return (
    <WidgetContainer>
      <ConnectionsList
        isNewOrgBeingCreated={isNewOrgBeingCreated}
        setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
        connectionsData={connectionsData}
        organizationTypes={organizationTypes}
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
      />
      <ConnectionPanel
        entityId={entity._id}
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
        setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
        isNewOrgBeingCreated={isNewOrgBeingCreated}
        connectionsData={connectionsData}
      />
    </WidgetContainer>
  )
}

OrganizationConnectionsWidget.propTypes = {
  entity: PropTypes.object.isRequired,
}

export default OrganizationConnectionsWidget
