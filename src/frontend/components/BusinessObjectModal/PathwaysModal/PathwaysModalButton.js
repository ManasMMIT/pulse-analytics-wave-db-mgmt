import React, { useState } from 'react'

import PathwaysModal from './PathwaysModal'

const PathwaysModalButton = ({
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
