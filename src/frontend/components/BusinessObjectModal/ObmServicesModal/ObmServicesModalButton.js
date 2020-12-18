import React, { useState } from 'react'

import Button from 'frontend/components/Button'

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
      <Button buttonStyle={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </Button>

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
