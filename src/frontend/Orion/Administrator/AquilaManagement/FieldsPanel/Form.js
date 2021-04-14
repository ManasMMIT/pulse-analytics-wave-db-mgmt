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
} from '../shared/styledComponents'

import {
  GET_BUSINESS_OBJECTS,
  GET_AQUILA_CONFIGS,
  GET_AQUILA_BUSINESS_OBJECTS,
  GET_AQUILA_BO_FILTER_SETTINGS,
} from 'frontend/api/queries'

const Form = ({
  data,
  afterMutationHook,
  mutationDoc,
  mutationVars,
  closeModal,
  selectedAquilaConfig,
}) => {
  const [stagedFieldLabel, setFieldLabel] = useState(data.label)
  const [stagedInputProps, setInputProps] = useState(
    JSON.stringify(data.inputProps || {})
  )
  const [stagedBoFieldId, setBoFieldId] = useState(null)

  const [saveField] = useMutation(mutationDoc, {
    variables: {
      input: {
        ...mutationVars,
        label: stagedFieldLabel,
        inputProps: stagedInputProps,
        boFieldId: stagedBoFieldId, // need to wait for query to assign correct initial field
      },
    },
    refetchQueries: [
      { query: GET_AQUILA_CONFIGS },
      { query: GET_AQUILA_BUSINESS_OBJECTS },
      {
        query: GET_AQUILA_BO_FILTER_SETTINGS,
        variables: { boId: selectedAquilaConfig.boId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (result) => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedField = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedField)
    },
    onError: alert,
  })

  const handleBoFieldIdChange = ({ value }) => setBoFieldId(value)

  const handleInputPropsChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value

    setInputProps(value)
  }

  const handleFieldChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setFieldLabel(value)
  }

  const { data: businessObjData, loading } = useQuery(GET_BUSINESS_OBJECTS)

  // ! set initial dropdown value for update form
  useEffect(() => {
    if (!loading) {
      if (data._id) {
        const underlyingBusinessObject = businessObjData.businessObjects.find(
          ({ _id }) => _id === selectedAquilaConfig.boId
        )

        const originalDataField = underlyingBusinessObject.fields.find(
          ({ _id }) => _id === data.boFieldId
        )

        const { _id: boFieldId } = originalDataField

        setBoFieldId(boFieldId)
      }
    }
  }, [businessObjData, loading, data])

  if (loading) return null

  const underlyingBusinessObject = businessObjData.businessObjects.find(
    ({ _id }) => _id === selectedAquilaConfig.boId
  )

  const fieldOptions = underlyingBusinessObject.fields.map(
    ({ _id: boFieldId, key }) => ({
      value: boFieldId,
      label: key,
    })
  )

  return (
    <FieldsFormContainer>
      <FieldContainer>
        <FormLabel>Field Key</FormLabel>

        <Select
          isDisabled={data._id} // not allowed to update boFieldId after creation
          styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          value={fieldOptions.find(({ value }) => value === stagedBoFieldId)}
          onChange={handleBoFieldIdChange}
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
        <FormLabel>React Select Input Props</FormLabel>
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
  selectedAquilaConfig: PropTypes.object,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  mutationVars: {},
  afterMutationHook: () => {},
  closeModal: () => {},
  selectedAquilaConfig: {},
}

export default Form
