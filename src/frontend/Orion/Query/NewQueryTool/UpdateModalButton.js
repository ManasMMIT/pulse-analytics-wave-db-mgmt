import React from 'react'

import BO_NAME_BOM_MAP from './bo-name-bom-map'

const UpdateModalButton = ({
  businessObjectName,
  refetchQueries,
  afterMutationHook,
  children,
  entityId,
}) => {
  const BoModalButton = BO_NAME_BOM_MAP[businessObjectName]

  const hasBusinessObjectModal = BoModalButton

  if (!hasBusinessObjectModal) return <div>{children}</div>

  return (
    <BoModalButton
      entityId={entityId}
      refetchQueries={refetchQueries}
      afterMutationHook={afterMutationHook}
    >
      <div style={{ cursor: 'pointer' }}>{children}</div>
    </BoModalButton>
  )
}

export default UpdateModalButton
