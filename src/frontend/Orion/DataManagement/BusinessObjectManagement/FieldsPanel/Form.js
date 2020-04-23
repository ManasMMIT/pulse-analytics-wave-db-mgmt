import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'

import {
  FormLabel,
  FieldContainer,
  FieldsFormContainer,
  StyledInput,
  StyledTextarea,
  StyledButton,
} from '../shared/styledComponents'

import { GET_WORKBOOKS } from '../../../../api/queries'

const TYPES = [
  'string',
  'number',
  'integer',
  'boolean',
  'csv',
  'date',
]

const Form = ({
  data,
  afterMutationHook,
  mutationDoc,
  mutationVars,
  closeModal,
}) => {
  const [stagedFieldName, setFieldName] = useState(data.name)

  const [saveField] = useMutation(mutationDoc, {
    variables: {
      input: {
        ...mutationVars,
        name: stagedFieldName,
      },
    },
    refetchQueries: [{ query: GET_WORKBOOKS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedField = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedField)
    },
    onError: e => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })

  // const handleFieldChange = e => {
  //   e.persist()
  //   const value = e.currentTarget && e.currentTarget.value
  //   setFieldName(value)
  // }

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>Field Key</FormLabel>

        <StyledInput type="text" disabled value={data.key} />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Field Type</FormLabel>

        <StyledInput type="text" disabled value={data.type} />
      </FieldContainer>

      <StyledButton onClick={() => {}}>Save Field</StyledButton>
    </FieldsFormContainer>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  closeModal: PropTypes.func,
  mutationVars: PropTypes.object,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  afterMutationHook: () => {},
  closeModal: () => {},
}

export default Form
