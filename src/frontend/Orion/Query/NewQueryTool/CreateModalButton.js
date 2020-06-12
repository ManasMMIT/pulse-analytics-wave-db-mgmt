import React from 'react'

import Button from 'frontend/components/Button'

import BO_NAME_BOM_MAP from './bo-name-bom-map'

const CreateModalButton = ({
  businessObjectName,
  refetchQueries,
  afterMutationHook,
}) => {
  const BoModalButton = BO_NAME_BOM_MAP[businessObjectName]

  if (!BoModalButton) return null

  return (
    <BoModalButton
      refetchQueries={refetchQueries}
      afterMutationHook={afterMutationHook}
    >
      <Button>Create {businessObjectName}</Button>
    </BoModalButton>
  )
}

export default CreateModalButton
