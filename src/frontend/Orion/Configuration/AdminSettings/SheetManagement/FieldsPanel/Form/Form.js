import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'

import BusinessObjectValidationForm from './BusinessObjectValidationForm'

import {
  FormLabel,
  FieldContainer,
  FieldsFormContainer,
  StyledInput,
  StyledTextarea,
  StyledButton,
} from './../../shared/styledComponents'

import {
  GET_WORKBOOKS,
} from '../../../../../../api/queries'

const TYPES = [
  'string',
  'number',
  'integer',
  'boolean',
  'csv',
  'date',
  'location',
]

const Form = ({
  data,
  afterMutationHook,
  mutationDoc,
  mutationVars,
  closeModal,
}) => {
  const [stagedFieldName, setFieldName] = useState(data.name)
  const [stagedType, setType] = useState(data.type)
  const [stagedOneOf, setOneOf] = useState(
    Array.isArray(data.oneOf)
      ? JSON.stringify(data.oneOf).replace(/\[|\]/g, '')
      : ''
  )

  let defaultStagedBusinessObjRef = null
  if (data.businessObjRef) {
    const { __typename, ...rest } = data.businessObjRef
      defaultStagedBusinessObjRef = rest
  }

  const [stagedBusinessObjRef, setBusinessObjRef] = useState(defaultStagedBusinessObjRef)

  const [saveField] = useMutation(mutationDoc, {
    variables: {
      input: {
        ...mutationVars,
        name: stagedFieldName,
        type: stagedType,
        oneOf: stagedOneOf,
        businessObjRef: stagedBusinessObjRef,
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

  const handleTypeSelection = obj => setType(obj.value)

  const handleOneOfChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setOneOf(value)
  }

  const handleFieldChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setFieldName(value)
  }

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>Field Name</FormLabel>
        <StyledInput
          type="text"
          value={stagedFieldName}
          onChange={handleFieldChange}
        />
      </FieldContainer>

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
        <FormLabel>oneOf Restrictions</FormLabel>
        <StyledTextarea
          value={stagedOneOf}
          onChange={handleOneOfChange}
        />
      </FieldContainer>

      <BusinessObjectValidationForm
        stagedBusinessObjRef={stagedBusinessObjRef}
        setBusinessObjRef={setBusinessObjRef}
      />

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
