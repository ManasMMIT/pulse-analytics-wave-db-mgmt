import { jsx } from '@emotion/core'
import React, { useState } from 'react'

import PathwaysModal from './PathwaysModal'

const PathwaysModalButton = ({
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
        <PathwaysModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default PathwaysModalButton
