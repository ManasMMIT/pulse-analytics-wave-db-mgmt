import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'

import Icon from 'frontend/components/Icon'
import Button from 'frontend/components/Button'
import Color from 'frontend/utils/color'
import usePathwaysPersonConnections from 'frontend/hooks/usePathwaysPersonConnections'
import Spinner from 'frontend/components/Spinner'
import ConnectionListItem from './ConnectionListItem'
import ConnectionsList from './../../shared/widget/ConnectionsList'
import ConnectionPanel from './../../shared/widget/ConnectionPanel'
import PathwaysInfluencersForm from '../../shared/widget/PathwaysInfluencersForm'
import { INFLUENCER_ALERT_TYPE } from './../../shared/widget/alert-types'

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

const getStubbedNewInfluencer = (pathwaysId) => ({
  pathwaysId,
  personId: null,
  firstName: 'New',
  lastName: 'Person Connection',
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
})

const FORM_CONFIG = {
  Form: PathwaysInfluencersForm,
  refKey: 'personId',
}

const WIDGET_TITLE = 'Influencer Connections'

const InfluencerConnectionsWidget = ({ entity }) => {
  const { _id: pathwaysId } = entity

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = usePathwaysPersonConnections({ pathwaysId })

  const [selectedConnection, changeConnection] = useState({})
  const [
    isNewConnectionBeingCreated,
    setWhetherNewConnectionBeingCreated,
  ] = useState(false)
  const [anyUnsavedChanges, setWhetherUnsavedChanges] = useState(false)

  useEffect(() => {
    if (!connectionsLoading && connectionsData.length) {
      changeConnection(connectionsData[0])
    }
  }, [connectionsLoading])

  if (connectionsLoading) return <Spinner size={28} />

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

  const createInfluencerConnectionHandler = () => {
    if (anyUnsavedChanges) {
      alert(
        "You have unsaved changes! Please save or cancel the connection you're on."
      )
    } else {
      const stagedNewInfluencer = getStubbedNewInfluencer(pathwaysId)
      setWhetherNewConnectionBeingCreated(true)
      changeConnection(stagedNewInfluencer)
    }
  }

  const createButton = (
    <Button type="secondary" onClick={createInfluencerConnectionHandler}>
      <Icon iconName="add" color1={Color.PRIMARY} width={16} />
    </Button>
  )

  const { firstName, lastName } = selectedConnection || {}

  const panelTitle = `${firstName} ${lastName}`

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
        formConfig={FORM_CONFIG}
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

InfluencerConnectionsWidget.propTypes = {
  entity: PropTypes.object.isRequired,
}

export default InfluencerConnectionsWidget
