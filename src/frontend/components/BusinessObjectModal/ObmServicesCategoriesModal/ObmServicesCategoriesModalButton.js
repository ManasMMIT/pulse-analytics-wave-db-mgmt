import React, { useState } from 'react'

import ObmServicesCategoriesModal from './ObmServicesCategoriesModal'

const ObmServicesCategoriesModalButton = ({
  children,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => {
  const [showModal, setModal] = useState(false)

  return (
    <>
      <button onClick={() => setModal(!showModal)}>{children}</button>
      {showModal && (
        <ObmServicesCategoriesModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default ObmServicesCategoriesModalButton
