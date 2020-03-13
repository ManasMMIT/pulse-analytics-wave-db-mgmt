import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { GET_WORKBOOKS } from '../../../../../api/queries'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

const Form = ({
  data,
  mutationDoc,
  mutationVars,
  afterMutationHook,
  closeModal,
}) => {
  const [stagedSheetName, setSheetName] = useState(data.name)
  const [stagedCollectionName, setCollectionName] = useState(data.collection)

  const [saveSheet] = useMutation(mutationDoc, {
    variables: {
      input: {
        ...mutationVars,
        sheetId: data._id,
        name: stagedSheetName,
        collection: stagedCollectionName,
      }
    },
    refetchQueries: [{ query: GET_WORKBOOKS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedSheet = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedSheet)
    },
    awaitRefetchQueries: true,
  })

  const handleSheetNameChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setSheetName(value)
  }

  const handleCollectionNameChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setCollectionName(value)
  }

  return (
    <>
      <FieldContainer>
        <FormLabel>Sheet Name</FormLabel>
        <StyledInput
          type="text"
          value={stagedSheetName}
          onChange={handleSheetNameChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Collection Name</FormLabel>
        <StyledInput
          type="text"
          value={stagedCollectionName}
          onChange={handleCollectionNameChange}
        />
      </FieldContainer>

      <StyledButton onClick={saveSheet}>Submit</StyledButton>
    </>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  afterMutationHook: () => {},
}

export default Form
