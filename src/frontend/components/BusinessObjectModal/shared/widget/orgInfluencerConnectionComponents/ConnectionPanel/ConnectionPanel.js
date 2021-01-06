import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import SectionTitle from 'frontend/components/SectionTitle'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'

import ButtonCluster from './ButtonCluster'

import EventLog from 'frontend/components/EventLog'

import { ConnectionPanelWrapper } from './styledComponents'

const TABS_DATA = [
  'Details',
  'History',
  // TODO: 'Comments'
]

const ConnectionPanel = ({
  entityId,
  title,
  formConfig,
  selectedConnection,
  changeConnection,
  connectionsData,
  setWhetherNewConnectionBeingCreated,
  isNewConnectionBeingCreated,
  setWhetherUnsavedChanges,
}) => {
  const [connectionData, setConnectionData] = useState(
    _.cloneDeep(selectedConnection)
  )
  const [eventLogFilters, setEventLogFilters] = useState({})

  const { refKey, Form } = formConfig

  const cancelHandler = () => {
    changeConnection(_.isEmpty(connectionsData) ? {} : connectionsData[0])
    setWhetherNewConnectionBeingCreated(false)
    setWhetherUnsavedChanges(false)
  }

  useEffect(() => {
    if (!_.isEmpty(selectedConnection)) {
      setConnectionData(selectedConnection)

      // if the selected connection has been persisted,
      // THEN you can setEventLogFilters to get history; otherwise, leave it empty
      if (selectedConnection._id) {
        setEventLogFilters({
          entityIds: [entityId, selectedConnection[refKey]],
        })
      } else {
        setEventLogFilters({})
      }
    }
  }, [selectedConnection])

  console.log(connectionData)

  return (
    <ConnectionPanelWrapper>
      <SectionTitle
        title={title}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          connectionData={connectionData}
          cancelHandler={cancelHandler}
          changeConnection={changeConnection}
          connectionsData={connectionsData}
          isNewConnectionBeingCreated={isNewConnectionBeingCreated}
          setWhetherUnsavedChanges={setWhetherUnsavedChanges}
          setWhetherNewConnectionBeingCreated={
            setWhetherNewConnectionBeingCreated
          }
        />
      </SectionTitle>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${AlphaColors.Black10}`,
          paddingLeft: Spacing.S4,
        }}
      >
        <Form
          connectionData={connectionData}
          isNewConnectionBeingCreated={isNewConnectionBeingCreated}
          setConnectionData={setConnectionData}
          setWhetherUnsavedChanges={setWhetherUnsavedChanges}
          refKey={refKey}
        />

        {Boolean(connectionData._id) ? (
          <EventLog filters={eventLogFilters} />
        ) : (
          <div style={{ padding: 24 }}>
            New unsaved connection doesn't have history
          </div>
        )}
      </UnderlinedTabs>
    </ConnectionPanelWrapper>
  )
}

ConnectionPanel.propTypes = {
  entityId: PropTypes.string.isRequired,
  changeConnection: PropTypes.func.isRequired,
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedConnection: PropTypes.object.isRequired,
  setWhetherNewConnectionBeingCreated: PropTypes.func.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
}

export default ConnectionPanel
