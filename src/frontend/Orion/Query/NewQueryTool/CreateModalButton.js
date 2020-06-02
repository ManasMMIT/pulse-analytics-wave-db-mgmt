import React from 'react'

import Button from 'frontend/components/Button'

import PathwaysModalButton from 'frontend/components/BusinessObjectModal/PathwaysModal/PathwaysModalButton'
import OncologyBenefitManagerModalButton from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'

const BO_NAME_BOM_MAP = {
  'Pathways': PathwaysModalButton,
  'Oncology Benefit Manager': OncologyBenefitManagerModalButton,
}

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
