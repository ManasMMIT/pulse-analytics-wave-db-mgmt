import React from 'react'
import _ from 'lodash'

import ConnectionPanel from './ConnectionPanel'

const ConnectionPanelContainer = ({
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
  if (_.isEmpty(selectedConnection)) return 'No connections'

  return (
    <ConnectionPanel
      selectedConnection={selectedConnection}
      entityId={entityId}
      title={title}
      formConfig={formConfig}
      changeConnection={changeConnection}
      connectionsData={connectionsData}
      setWhetherNewConnectionBeingCreated={setWhetherNewConnectionBeingCreated}
      isNewConnectionBeingCreated={isNewConnectionBeingCreated}
      setWhetherUnsavedChanges={setWhetherUnsavedChanges}
    />
  )
}

export default ConnectionPanelContainer
