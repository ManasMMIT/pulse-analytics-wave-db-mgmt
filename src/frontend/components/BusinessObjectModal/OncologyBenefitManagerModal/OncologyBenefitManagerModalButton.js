import React, { useState } from 'react'

import Button from 'frontend/components/Button'

import OncologyBenefitManagerModal from './OncologyBenefitManagerModal'

const OncologyBenefitManagerModalButton = ({
  children,
  buttonStyle = {},
  entityId,
  refetchQueries,
  afterMutationHook,
}) => {
  const [showModal, setModal] = useState(false)

  return (
    <>
      <Button buttonStyle={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </Button>

      {showModal && (
        <OncologyBenefitManagerModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default OncologyBenefitManagerModalButton
