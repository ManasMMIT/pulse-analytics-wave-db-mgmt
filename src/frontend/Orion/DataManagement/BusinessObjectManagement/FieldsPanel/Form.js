import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'

import {
  FormLabel,
  FieldContainer,
  FieldsFormContainer,
  StyledInput,
  StyledButton,
} from '../shared/styledComponents'

import { GET_BUSINESS_OBJECTS } from '../../../../api/queries'

const TYPES = [
  'string',
  'objectId',
  'array',
  'bool',
  'date',
  'null',
  'int',
  'decimal',
]

const Form = ({
  data,
  afterMutationHook,
  mutationDoc,
  mutationVars,
  closeModal,
}) => {
  const [stagedFieldKey, setFieldKey] = useState(data.key)
  const [stagedType, setType] = useState(data.type)

  const input = data._id
    ? ({
      ...mutationVars,
      field: {
        _id: data._id,
        key: stagedFieldKey,
        type: stagedType,
      },
    })
    : ({
      ...mutationVars,
      field: {
        key: stagedFieldKey,
        type: stagedType,
      }
    })

  const [saveField] = useMutation(mutationDoc, {
    variables: { input },
    refetchQueries: [{ query: GET_BUSINESS_OBJECTS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedField = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedField)
    },
    onError: e => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })

  const handleTypeSelection = obj => setType(obj.value)

  const handleFieldChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setFieldKey(value)
  }

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>Field Type</FormLabel>

        <Select
          styles={{ container: base => ({ ...base, flex: 1 }) }}
          value={{ value: stagedType, label: stagedType }}
          defaultValue={TYPES[0]}
          onChange={handleTypeSelection}
          options={TYPES.map(type => ({ value: type, label: type }))}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Key</FormLabel>
        <StyledInput
          type="text"
          value={stagedFieldKey}
          onChange={handleFieldChange}
        />
      </FieldContainer>

      <StyledButton onClick={saveField}>Save Field</StyledButton>
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
