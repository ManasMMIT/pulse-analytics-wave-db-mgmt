import React, { useState } from 'react'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'

import ConnectionsList from './ConnectionsList'

const WidgetContainer = styled.div({
  display: 'flex',
  width: '100%',
})

const OrganizationConnectionsWidget = ({ entity }) => {
  const [selectedOrgType, changeOrgType] = useState(null)
  return (
    <WidgetContainer>
      <ConnectionsList
        personId={entity._id}
        selectedOrgType={selectedOrgType}
        changeOrgType={changeOrgType}
      />
      {
        // TODO: Create Organization Connection Creation Form
      }
    </WidgetContainer>
  )
}

OrganizationConnectionsWidget.propTypes = {
  entityId: PropTypes.string.isRequired,
}

export default OrganizationConnectionsWidget
