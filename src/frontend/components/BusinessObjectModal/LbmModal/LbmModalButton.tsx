import React, { FunctionComponent, useState } from 'react'

import Button from 'frontend/components/Button'

import LbmModal, { LbmModalAndModalButtonSharedProps } from './LbmModal'

interface LbmModalButton extends LbmModalAndModalButtonSharedProps {
  buttonStyle: { [key: string]: any }
}

const LbmModalButton: FunctionComponent<LbmModalButton> = ({
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
        <LbmModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default LbmModalButton
