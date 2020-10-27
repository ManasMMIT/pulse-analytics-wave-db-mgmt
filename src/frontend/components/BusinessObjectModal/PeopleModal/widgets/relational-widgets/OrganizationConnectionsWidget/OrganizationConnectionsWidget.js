import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import ConnectionsList from './ConnectionsList'
import ConnectionPanel from './ConnectionPanel'

import usePathwaysPersonConnections from 'frontend/hooks/usePathwaysPersonConnections'
import Spinner from 'frontend/components/Spinner'

import { GET_ORGANIZATION_TYPES } from 'frontend/api/queries'

const OVERLAY_1_STYLE_RAW = `
  position: absolute;
  top: 0px;
  left: 0px;
  background: #0A2E4D;
  width: 100%;
  height: 102%;
  opacity: 0.5;
  border-bottom: 0px;
`

const OVERLAY_2_STYLE_RAW = `
  position: absolute;
  top: 0px;
  left: 0px;
  background: #0A2E4D;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  border-bottom: 0px;
`

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
  const [anyUnsavedChanges, setWhetherUnsavedChanges] = useState(false)

  useEffect(() => {
    if (!orgTypeLoading && !connectionsLoading && connectionsData.length) {
      changeOrganization(connectionsData[0])
    }
  }, [connectionsLoading, orgTypeLoading])

  if (orgTypeLoading || connectionsLoading) return <Spinner size={28} />

  const { organizationTypes } = organizationTypeData

  const boModalHeaderNode = document.querySelector('#BoModalHeader')
  const bomSidebar = document.querySelector('#BomSidebar')
  const headerOverlay = boModalHeaderNode.querySelector('#bomHeaderOverlay')
  const sidebarOverlay = bomSidebar.querySelector('#bomSidebarOverlay')

  if (anyUnsavedChanges) {
    if (!headerOverlay) {
      const overlayDiv = document.createElement('div')
      overlayDiv.id = 'bomHeaderOverlay'
      overlayDiv.style = OVERLAY_1_STYLE_RAW
      boModalHeaderNode.appendChild(overlayDiv)
    }

    if (!sidebarOverlay) {
      const overlayDiv2 = document.createElement('div')
      overlayDiv2.id = 'bomSidebarOverlay'
      overlayDiv2.style = OVERLAY_2_STYLE_RAW
      bomSidebar.appendChild(overlayDiv2)
    }
  } else {
    if (headerOverlay) boModalHeaderNode.removeChild(headerOverlay)
    if (sidebarOverlay) bomSidebar.removeChild(sidebarOverlay)
  }

  return (
    <WidgetContainer>
      <ConnectionsList
        personId={entity._id}
        isNewOrgBeingCreated={isNewOrgBeingCreated}
        setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
        connectionsData={connectionsData}
        organizationTypes={organizationTypes}
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
        anyUnsavedChanges={anyUnsavedChanges}
      />
      <ConnectionPanel
        entityId={entity._id}
        selectedOrganization={selectedOrganization}
        changeOrganization={changeOrganization}
        setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
        isNewOrgBeingCreated={isNewOrgBeingCreated}
        connectionsData={connectionsData}
        setWhetherUnsavedChanges={setWhetherUnsavedChanges}
      />
    </WidgetContainer>
  )
}

OrganizationConnectionsWidget.propTypes = {
  entity: PropTypes.object.isRequired,
}

export default OrganizationConnectionsWidget
