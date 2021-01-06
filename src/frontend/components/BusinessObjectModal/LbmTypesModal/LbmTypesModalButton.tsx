import React, { FunctionComponent, useState } from 'react'

import Button from 'frontend/components/Button'

import LbmTypesModal from './LbmTypesModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

interface LbmTypesModalButton extends ModalAndModalButtonSharedProps {
  buttonStyle: { [key: string]: any }
}

const LbmTypesModalButton: FunctionComponent<LbmTypesModalButton> = ({
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
        <LbmTypesModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default LbmTypesModalButton
