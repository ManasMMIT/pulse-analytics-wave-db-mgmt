import { jsx } from '@emotion/core'
import React, { useState } from 'react'

import ObmServicesModal from './ObmServicesModal'

const ObmServicesModalButton = ({
  children,
  entityId,
  refetchQueries,
  afterMutationHook,
  buttonStyle = {},
}) => {
  const [showModal, setModal] = useState(false)

  return (
    <>
      <button css={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </button>

      {showModal && (
        <ObmServicesModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default ObmServicesModalButton
