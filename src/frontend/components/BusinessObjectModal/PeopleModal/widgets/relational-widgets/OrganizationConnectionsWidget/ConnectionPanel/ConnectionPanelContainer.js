import React from 'react'
import _ from 'lodash'

import ConnectionPanel from './ConnectionPanel'

const ConnectionPanelContainer = ({
  entityId,
  selectedOrganization,
  changeOrganization,
  connectionsData,
  setWhetherNewOrgBeingCreated,
  isNewOrgBeingCreated,
}) => {
  if (_.isEmpty(selectedOrganization)) return 'No connections'

  return (
    <ConnectionPanel
      selectedOrganization={selectedOrganization}
      entityId={entityId}
      changeOrganization={changeOrganization}
      connectionsData={connectionsData}
      setWhetherNewOrgBeingCreated={setWhetherNewOrgBeingCreated}
      isNewOrgBeingCreated={isNewOrgBeingCreated}
    />
  )
}

export default ConnectionPanelContainer
