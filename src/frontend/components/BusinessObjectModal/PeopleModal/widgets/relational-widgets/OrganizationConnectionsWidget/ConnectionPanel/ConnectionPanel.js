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
import PathwaysForm from './PathwaysForm'
import EventLog from 'frontend/components/EventLog'

import { ConnectionPanelWrapper } from './styledComponents'

const ORG_TYPE_TO_FORM_MAP = {
  Pathways: {
    Form: PathwaysForm,
    refKey: 'pathwaysId',
  },
}

const TABS_DATA = [
  'Details',
  'History',
  // TODO: 'Comments'
]

const ConnectionPanel = ({
  entityId,
  selectedOrganization,
  changeOrganization,
  connectionsData,
  setWhetherNewOrgBeingCreated,
  isNewOrgBeingCreated,
  setWhetherUnsavedChanges,
}) => {
  const [orgData, setOrgData] = useState(_.cloneDeep(selectedOrganization))
  const [eventLogFilters, setEventLogFilters] = useState({})

  const { organization, organizationType } = orgData
  const { refKey, Form } = ORG_TYPE_TO_FORM_MAP[organizationType] || {}

  const cancelHandler = () => {
    changeOrganization(connectionsData[0])
    setWhetherNewOrgBeingCreated(false)
    setWhetherUnsavedChanges(false)
  }

  useEffect(() => {
    if (!_.isEmpty(selectedOrganization)) {
      setOrgData(selectedOrganization)

      // if the selected connection has been persisted,
      // THEN you can setEventLogFilters to get history; otherwise, leave it empty
      if (selectedOrganization._id) {
        setEventLogFilters({
          entityIds: [entityId, selectedOrganization[refKey]],
        })
      } else {
        setEventLogFilters({})
      }
    }
  }, [selectedOrganization])

  console.log(orgData)

  return (
    <ConnectionPanelWrapper>
      <SectionTitle
        title={organization}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          orgData={orgData}
          cancelHandler={cancelHandler}
          changeOrganization={changeOrganization}
          connectionsData={connectionsData}
          isNewOrgBeingCreated={isNewOrgBeingCreated}
          setWhetherUnsavedChanges={setWhetherUnsavedChanges}
          setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
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
          orgData={orgData}
          isNewOrgBeingCreated={isNewOrgBeingCreated}
          setOrgData={setOrgData}
          setWhetherUnsavedChanges={setWhetherUnsavedChanges}
        />

        {Boolean(orgData._id) ? (
          <EventLog filters={eventLogFilters} />
        ) : (
          <div>New unsaved connection doesn't have history</div>
        )}
      </UnderlinedTabs>
    </ConnectionPanelWrapper>
  )
}

ConnectionPanel.propTypes = {
  entityId: PropTypes.string.isRequired,
  changeOrganization: PropTypes.func.isRequired,
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  setWhetherNewOrgBeingCreated: PropTypes.func.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
}

export default ConnectionPanel
