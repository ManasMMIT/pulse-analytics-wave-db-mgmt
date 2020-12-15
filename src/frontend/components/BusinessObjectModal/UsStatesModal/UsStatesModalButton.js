import { jsx } from '@emotion/core'
import React, { useState } from 'react'

import UsStatesModal from './UsStatesModal'

const UsStatesModalButton = ({
  buttonStyle = {},
  children,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => {
  const [showModal, setModal] = useState(false)

  return (
    <>
      <button css={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </button>

      {showModal && (
        <UsStatesModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default UsStatesModalButton
