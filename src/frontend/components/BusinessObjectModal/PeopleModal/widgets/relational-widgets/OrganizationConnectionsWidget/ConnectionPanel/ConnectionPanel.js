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

const ORG_TYPE_MAP = {
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
}) => {
  const cancelHandler = () => {
    changeOrganization(connectionsData[0])
    setWhetherNewOrgBeingCreated(false)
  }

  const { organization, organizationType } = selectedOrganization

  const { refKey, Form } = ORG_TYPE_MAP[organizationType] || {}

  const [data, setData] = useState(selectedOrganization)

  const [eventLogFilters, setEventLogFilters] = useState({})

  useEffect(() => {
    if (!_.isEmpty(selectedOrganization)) {
      setData(selectedOrganization)

      if (refKey in selectedOrganization) {
        setEventLogFilters({
          entityIds: [entityId, selectedOrganization[refKey]],
        })
      } else {
        setEventLogFilters({})
      }
    }
  }, [selectedOrganization])

  return (
    <ConnectionPanelWrapper>
      <SectionTitle
        title={organization}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          data={data}
          cancelHandler={cancelHandler}
          isNewOrgBeingCreated={isNewOrgBeingCreated}
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
        {/* <Form data={data} /> */}
        <div>hello</div>

        {selectedOrganization && refKey in selectedOrganization ? (
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
}

export default ConnectionPanel
