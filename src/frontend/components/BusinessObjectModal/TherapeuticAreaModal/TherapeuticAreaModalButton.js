/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useState } from 'react'

import TherapeuticAreaModal from './TherapeuticAreaModal'

const TherapeuticAreaModalButton = ({
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
        <TherapeuticAreaModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default TherapeuticAreaModalButton
