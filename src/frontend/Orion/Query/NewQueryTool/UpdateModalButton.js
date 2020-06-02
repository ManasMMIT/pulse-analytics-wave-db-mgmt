import React from 'react'

import PathwaysModalButton from 'frontend/components/BusinessObjectModal/PathwaysModal/PathwaysModalButton'
import OncologyBenefitManagerModalButton from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'

const BO_NAME_BOM_MAP = {
  'Pathways': PathwaysModalButton,
  'Oncology Benefit Manager': OncologyBenefitManagerModalButton,
}

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
