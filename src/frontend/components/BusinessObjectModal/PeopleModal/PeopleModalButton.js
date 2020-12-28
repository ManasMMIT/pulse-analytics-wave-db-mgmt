import React, { useState } from 'react'

import Button from 'frontend/components/Button'

import PeopleModal from './PeopleModal'

const PeopleModalButton = ({
  buttonStyle,
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

PeopleModalButton.defaultProps = {
  buttonStyle: {},
  children: undefined,
  entityId: undefined,
  refetchQueries: undefined,
  afterMutationHook: undefined,
}

export default PeopleModalButton
