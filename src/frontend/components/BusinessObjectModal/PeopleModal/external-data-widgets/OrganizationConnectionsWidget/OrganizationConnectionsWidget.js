import React, { useState } from 'react'

import styled from '@emotion/styled'

import ConnectionsList from './ConnectionsList'

const WidgetContainer = styled.div({
  display: 'flex',
  width: '100%',
})

const OrganizationConnectionsWidget = (props) => {
  const [selectedOrgType, changeOrgType] = useState(null)
  return (
    <WidgetContainer>
      <ConnectionsList
        selectedOrgType={selectedOrgType}
        changeOrgType={changeOrgType}
      />
      {
        // TODO: Create Organization Connection Creation Form
      }
    </WidgetContainer>
  )
}

OrganizationConnectionsWidget.propTypes = {}

export default OrganizationConnectionsWidget
