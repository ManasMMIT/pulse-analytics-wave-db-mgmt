import React from 'react'

import { useMutation } from '@apollo/react-hooks'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import STUB_DOC from 'frontend/api/utils/stub-doc'

import Button from '../../Button'

const ButtonGroup = ({
  mutationDocs,
  toggleDeleteConfirmation,
  showDeleteConfirmation,
  closeModal,
  entityId,
  inputFields,
  refetchQueries,
  afterMutationHook,
}) => {
  const isEditModal = Boolean(entityId)

  const saveMutationToUse = isEditModal
    ? mutationDocs.update || STUB_DOC
    : mutationDocs.create || STUB_DOC

  const inputToUse = isEditModal
    ? { _id: entityId, ...inputFields }
    : inputFields

  const [save] = useMutation(saveMutationToUse, {
    variables: { input: inputToUse },
    refetchQueries,
    onCompleted: (data) => {
      afterMutationHook(data)
      closeModal()
    },
    awaitRefetchQueries: true,
    onError: alert,
  })

  return (
    <div
      style={{
        margin: `0 ${Spacing.S4}`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isEditModal && mutationDocs.delete && (
        <Button
          buttonStyle={{ margin: Spacing.S3 }}
          color={Color.RED}
          type="secondary"
          iconName="delete"
          iconColor1={Color.RED}
          onClick={() => toggleDeleteConfirmation(!showDeleteConfirmation)}
        >
          {showDeleteConfirmation ? 'Cancel Delete' : 'Delete'}
        </Button>
      )}
      <Button
        buttonStyle={{ margin: Spacing.S3 }}
        color={Color.GRAY_DARK}
        type="secondary"
        onClick={closeModal}
      >
        Cancel + Close
      </Button>
      <Button
        buttonStyle={{ margin: Spacing.S3 }}
        color={Color.GREEN}
        onClick={save}
      >
        Save + Close
      </Button>
    </div>
  )
}
export default ButtonGroup
