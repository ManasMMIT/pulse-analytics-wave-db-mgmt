import React, { FunctionComponent, useState } from 'react'

import Button from 'frontend/components/Button'

import LbmModal from './LbmModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'
interface LbmModalButtonProps extends ModalAndModalButtonSharedProps {
  buttonStyle: { [key: string]: any }
}

const LbmModalButton: FunctionComponent<LbmModalButtonProps> = ({
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
