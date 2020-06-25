import React, { useState } from 'react'

import PeopleModal from './PeopleModal'

const PeopleModalButton = ({
  buttonStyle = {},
  children,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => {
  const [showModal, setModal] = useState(false)

  return (
    <>
      <button style={buttonStyle} onClick={() => setModal(!showModal)}>
        {children}
      </button>
      {showModal && (
        <PeopleModal
          entityId={entityId}
          closeModal={() => setModal(false)}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      )}
    </>
  )
}

export default PeopleModalButton
