import React, { useState } from 'react'

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
      <button style={buttonStyle} onClick={() => setModal(!showModal)}>{children}</button>
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
