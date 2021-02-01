import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'

import Spacing from 'frontend/utils/spacing'
import STUB_DOC from 'frontend/api/utils/stub-doc'

import DeleteButton from './DeleteButton'
import CancelButton from './CancelButton'
import CloseButton from './CloseButton'
import SaveButton from './SaveButton'

const ButtonGroup = ({
  setBoData,
  mutationDocs,
  toggleDeleteConfirmation,
  showDeleteConfirmation,
  closeModal,
  entityId,
  entityIdField, // ! TEMP prop for split psql/mongo data
  boData,
  refetchQueries,
  afterMutationHook,
  isEditModal,
  setCurrentEntityId,
}) => {
  const [stagedBoData, setStagedBoData] = useState(boData)
  let isEditingInProgress = !_.isEqual(stagedBoData, boData)

  useEffect(() => {
    if (_.isEmpty(stagedBoData)) {
      setStagedBoData(boData)
    }
  }, [boData])

  const resetInput = () => setBoData(stagedBoData)

  const saveMutationToUse = isEditModal
    ? mutationDocs.update || STUB_DOC
    : mutationDocs.create || STUB_DOC

  const inputToUse = isEditModal
    ? { [entityIdField]: entityId, ...boData }
    : boData

  const [save, { loading: isMutationLoading }] = useMutation(
    saveMutationToUse,
    {
      refetchQueries,
      onCompleted: (data) => {
        afterMutationHook(data)
        const {
          [entityIdField]: currentEntityId,
          ...restOfEntity
        } = Object.values(data)[0]

        // only use returned entity fields that are part of input
        const entityDataToStage = Object.keys(boData).reduce((acc, key) => {
          acc[key] = restOfEntity[key]
          return acc
        }, {})

        setStagedBoData(entityDataToStage)
        if (!isEditModal) {
          setCurrentEntityId(currentEntityId)
        }
      },
      awaitRefetchQueries: true,
      onError: (error) => {
        if (error.message.match(/similar names/i)) {
          if (
            window.confirm(
              `${error.message} -- Are you sure this wouldn't duplicate an existing Person? Click 'OK' to save anyway. Clicking 'Cancel' closes this error message (Return to the list of all People to verify duplicate people entries before creating people with duplicate names).`
            )
          ) {
            save({
              variables: { input: { ...inputToUse, skipDupeCheck: true } },
            })
          }

          return
        }

        alert(error)
      },
    }
  )

  let buttons = (
    <>
      <DeleteButton
        isDisplayed={isEditModal && mutationDocs.delete}
        toggleDeleteConfirmation={toggleDeleteConfirmation}
        showDeleteConfirmation={showDeleteConfirmation}
      />
      <CloseButton closeModal={closeModal} />
    </>
  )

  if (isEditingInProgress) {
    buttons = (
      <>
        <DeleteButton
          isDisplayed={isEditModal && mutationDocs.delete}
          toggleDeleteConfirmation={toggleDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
        />
        <CancelButton resetInput={resetInput} />
        <SaveButton
          save={() => save({ variables: { input: inputToUse } })}
          inFlight={isMutationLoading}
        />
      </>
    )
  }

  console.log(inputToUse)

  return (
    <div
      style={{
        margin: `0 ${Spacing.S3}`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {buttons}
    </div>
  )
}

export default ButtonGroup
