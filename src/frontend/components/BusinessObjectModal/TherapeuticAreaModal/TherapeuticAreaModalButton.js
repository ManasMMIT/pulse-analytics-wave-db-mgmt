import React, { useState } from 'react'

import Button from 'frontend/components/Button'

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
      <Button buttonStyle={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </Button>

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
