import React, { FunctionComponent, useState } from 'react'

import Button from 'frontend/components/Button'

import LbmServicesCategoriesModal from './LbmServicesCategoriesModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

interface LbmServicesCategoriesModalButtonProps extends ModalAndModalButtonSharedProps {
  buttonStyle: { [key: string]: any }
}

const LbmServicesCategoriesModalButton: FunctionComponent<LbmServicesCategoriesModalButtonProps> = ({
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
        <LbmServicesCategoriesModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default LbmServicesCategoriesModalButton
