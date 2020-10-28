import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import { GET_ORGANIZATION_TYPES } from 'frontend/api/queries'
import usePathwaysPersonConnections from 'frontend/hooks/usePathwaysPersonConnections'
import Spinner from 'frontend/components/Spinner'
import ConnectionListItem from './ConnectionListItem'
import ConnectionsList from '../../../shared/widget/ConnectionsList'
import ConnectionPanel from '../../../shared/widget/ConnectionPanel'
import { INFLUENCER_ALERT_TYPE } from '../../../shared/widget/alert-types'
import CreateButton from './CreateButton'
import PathwaysInfluencerForm from '../../../shared/widget/PathwaysInfluencersForm'

// TODO: Move overlay code into shared components
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
      valueChairsIndications: [],
    },
    position: '',
    priority: null,
    alert: {
      date: null,
      type: INFLUENCER_ALERT_TYPE,
      description: '',
    },
    exclusionSettings: {
      isExcluded: false,
      reason: '',
    },
    startDate: null,
    endDate: null,
    startQuarter: null,
    endQuarter: null,
  }),
}

const ORG_TYPE_TO_FORM_MAP = {
  Pathways: {
    Form: PathwaysInfluencerForm,
    refKey: 'pathwaysId',
  },
}

const WIDGET_TITLE = 'Organization Connections'

const OrganizationConnectionsWidget = ({ entity }) => {
  const { _id: personId } = entity
  const { data: organizationTypeData, loading: orgTypeLoading } = useQuery(
    GET_ORGANIZATION_TYPES
  )

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = usePathwaysPersonConnections({ personId })

  const [selectedConnection, changeConnection] = useState({})
  const [
    isNewConnectionBeingCreated,
    setWhetherNewConnectionBeingCreated,
  ] = useState(false)
  const [anyUnsavedChanges, setWhetherUnsavedChanges] = useState(false)

  useEffect(() => {
    if (!orgTypeLoading && !connectionsLoading && connectionsData.length) {
      changeConnection(connectionsData[0])
    }
  }, [connectionsLoading, orgTypeLoading])

  if (orgTypeLoading || connectionsLoading) return <Spinner size={28} />

  const { organizationTypes } = organizationTypeData

  // TODO: Move overlay code into shared components
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

  const createOrgConnectionHandler = (orgType) => {
    if (anyUnsavedChanges) {
      alert(
        "You have unsaved changes! Please save or cancel the connection you're on."
      )
    } else {
      const stagedNewOrg = ORG_TYPE_TO_FORM_GENERATOR_MAP[orgType](personId)
      setWhetherNewConnectionBeingCreated(true)
      changeConnection(stagedNewOrg)
    }
  }

  const createButton = (
    <CreateButton
      clickHandler={createOrgConnectionHandler}
      organizationTypes={organizationTypes}
    />
  )

  const { organization: panelTitle, organizationType } =
    selectedConnection || {}
  const formConfig = ORG_TYPE_TO_FORM_MAP[organizationType] || {}

  return (
    <WidgetContainer>
      <ConnectionsList
        widgetTitle={WIDGET_TITLE}
        isNewConnectionBeingCreated={isNewConnectionBeingCreated}
        createButton={createButton}
        ConnectionListItem={ConnectionListItem}
        connectionsData={connectionsData}
        selectedConnection={selectedConnection}
        changeConnection={changeConnection}
        anyUnsavedChanges={anyUnsavedChanges}
      />
      <ConnectionPanel
        entityId={entity._id}
        title={panelTitle}
        formConfig={formConfig}
        selectedConnection={selectedConnection}
        changeConnection={changeConnection}
        setWhetherNewConnectionBeingCreated={
          setWhetherNewConnectionBeingCreated
        }
        isNewConnectionBeingCreated={isNewConnectionBeingCreated}
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
