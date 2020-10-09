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
  setWhetherUnsavedChanges,
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
      setWhetherUnsavedChanges={setWhetherUnsavedChanges}
    />
  )
}

export default ConnectionPanelContainer
