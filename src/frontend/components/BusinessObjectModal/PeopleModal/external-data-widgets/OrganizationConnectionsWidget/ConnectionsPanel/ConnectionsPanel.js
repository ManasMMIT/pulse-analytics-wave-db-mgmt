import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import SectionTitle from 'frontend/components/SectionTitle'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'

import ButtonCluster from './ButtonCluster'
import PathwaysForm from './PathwaysForm'

const ConnectionsPanelWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  borderLeft: `2px solid ${transparentize(0.9, Color.BLACK)}`,
})

const FORM_MAP = {
  Pathways: PathwaysForm,
}

const TABS_DATA = [
  'Details',
  // TODO: 'History',
  // TODO: 'Comments'
]

const ConnectionsPanel = ({
  selectedOrganization,
  hasNewOrgConnection,
  changeOrganization,
  setNewOrgConnectionStatus,
  personOrganizationConnections,
}) => {
  const cancelHandler = () => {
    changeOrganization(personOrganizationConnections[0])
    setNewOrgConnectionStatus(false)
  }
  const { organization, organizationType } = selectedOrganization
  const OrganizationForm = FORM_MAP[organizationType]

  return (
    <ConnectionsPanelWrapper>
      <SectionTitle
        title={organization}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          cancelHandler={cancelHandler}
          hasNewOrgConnection={hasNewOrgConnection}
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
        {organizationType && <OrganizationForm />}
      </UnderlinedTabs>
    </ConnectionsPanelWrapper>
  )
}

ConnectionsPanel.propTypes = {
  changeOrganization: PropTypes.func.isRequired,
  hasNewOrgConnection: PropTypes.bool.isRequired,
  personOrganizationConnections: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  setNewOrgConnectionStatus: PropTypes.func.isRequired,
}

export default ConnectionsPanel
