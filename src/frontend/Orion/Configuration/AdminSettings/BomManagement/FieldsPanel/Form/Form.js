import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/react-hooks'

import {
  FormLabel,
  FieldContainer,
  FieldsFormContainer,
  StyledInput,
  StyledTextarea,
  StyledButton,
} from './../../shared/styledComponents'

import {
  GET_BUSINESS_OBJECTS,
  GET_BOM_CONFIGS,
  GET_BOM_SCHEMA,
} from 'frontend/api/queries'

const HARD_CODED_INPUT_OPTIONS = [
  'Select',
  'TextInput',
  'DateInput',
  'EmailInput',
  'NumberInput',
  'RangeInput',
  'TimeInput',
  'CheckboxInput',
]

const Form = ({
  data,
  afterMutationHook,
  mutationDoc,
  mutationVars,
  closeModal,
  selectedBom,
}) => {
  const [stagedFieldLabel, setFieldLabel] = useState(data.label)
  const [stagedInputComponent, setInputComponent] = useState(data.inputComponent)
  const [stagedInputProps, setInputProps] = useState(JSON.stringify(data.inputProps || {}))
  const [stagedFieldOption, setFieldOption] = useState(null)

  const [saveField] = useMutation(mutationDoc, {
    variables: {
      input: {
        ...mutationVars,
        label: stagedFieldLabel,
        inputComponent: stagedInputComponent,
        inputProps: stagedInputProps,
        fieldId: (stagedFieldOption || {}).value, // need to wait for query to assign correct initial field
      }
    },
    refetchQueries: [{ query: GET_BOM_CONFIGS }, { query: GET_BOM_SCHEMA, variables: { boId: selectedBom.boId } }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedBomField = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedBomField)
    },
    awaitRefetchQueries: true,
    onError: e => {
      alert(e)
    }
  })

  const handleInputComponentSelection = obj => setInputComponent(obj.value)
  const handleFieldOptionSelection = obj => setFieldOption(obj)

  const handleInputPropsChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value

    setInputProps(value)
  }

  const handleFieldChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setFieldLabel(value)
  }

  const { data: businessObjData, loading } = useQuery(GET_BUSINESS_OBJECTS)

  // ! set initial dropdown value for update form
  useEffect(() => {
    if (!loading) {
      if (data._id) {
        const underlyingBusinessObject = businessObjData.businessObjects
          .find(({ _id }) => _id === selectedBom.boId)

        const originalDataField = underlyingBusinessObject.fields
          .find(({ _id }) => _id === data._id)

        const { _id, key, type } = originalDataField 

        let initialOption = { 
          value: _id, 
          label: `${key} (${type})`,
        }

        setFieldOption(initialOption)
      }
    }
  }, [businessObjData, loading, data])

  if (loading) return null

  const underlyingBusinessObject = businessObjData.businessObjects
    .find(({ _id }) => _id === selectedBom.boId)

  let fieldOptions = []
  if (underlyingBusinessObject) {
    fieldOptions = underlyingBusinessObject.fields.map(({ _id, key, type }) => ({
      value: _id,
      label: `${key} (${type})`, // hint at what the input component should be using boField's type
    }))
  }

  const inputOptions = HARD_CODED_INPUT_OPTIONS.map(inputType => ({ value: inputType, label: inputType }))

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>Field Key</FormLabel>

        <Select
          isDisabled={data._id} // not allowed to update fieldId after creation
          styles={{ container: base => ({ ...base, flex: 1 }) }}
          value={stagedFieldOption}
          defaultValue={fieldOptions[0]}
          onChange={handleFieldOptionSelection}
          options={fieldOptions}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Field Label</FormLabel>
        <StyledInput
          type="text"
          value={stagedFieldLabel}
          onChange={handleFieldChange}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Input Component</FormLabel>

        <Select
          styles={{ container: base => ({ ...base, flex: 1 }) }}
          value={{ label: stagedInputComponent, value: stagedInputComponent }}
          defaultValue={inputOptions[0]}
          onChange={handleInputComponentSelection}
          options={inputOptions}
        />
      </FieldContainer>

      <FieldContainer>
        <FormLabel>Input Props</FormLabel>
        <StyledTextarea
          value={stagedInputProps}
          onChange={handleInputPropsChange}
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
  selectedBom: PropTypes.object,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  mutationVars: {},
  afterMutationHook: () => {},
  closeModal: () => {},
  selectedBom: {},
}

export default Form
