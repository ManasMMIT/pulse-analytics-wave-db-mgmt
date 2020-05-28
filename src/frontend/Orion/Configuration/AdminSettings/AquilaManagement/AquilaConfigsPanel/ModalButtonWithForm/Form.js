import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/react-hooks'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

import {
  GET_BUSINESS_OBJECTS,
  GET_AQUILA_CONFIGS,
} from '../../../../../../api/queries'

const Form = ({
  data,
  mutationDoc,
  afterMutationHook,
  closeModal,
  mutationVars,
}) => {
  const [stagedLabel, setLabel] = useState(data.label)
  const [stagedBusinessObjId, setStagedBusinessObjId] = useState(data.boId)

  const [saveBom] = useMutation(mutationDoc, {
    variables: {
      input: { ...mutationVars, label: stagedLabel, boId: stagedBusinessObjId }
    },
    refetchQueries: [{ query: GET_AQUILA_CONFIGS }],
    awaitRefetchQueries: true,
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newAquilaConfig = result[targetDataKey]

      closeModal()
      afterMutationHook(newAquilaConfig)
    },
    onError: alert,
  })

  const { data: businessObjData, loading } = useQuery(GET_BUSINESS_OBJECTS)

  useEffect(() => {
    if (!loading) {
      const { businessObjects } = businessObjData

      let stagedBo = { label: businessObjects[0].name, value: businessObjects[0]._id }

      if (data.boId) {
        const underlyingBo = businessObjects.find(({ _id }) => _id === data.boId)
        stagedBo = { label: underlyingBo.name, value: underlyingBo._id }
      }

      setStagedBusinessObjId(stagedBo.value)
    }
  }, [businessObjData, loading])

  if (loading) return null

  const handleChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setLabel(value)
  }

  const boOptions = businessObjData.businessObjects
    .map(({ _id, name }) => ({
      value: _id,
      label: name,
    }))

  return (
    <>
      <FieldContainer>
        <FormLabel>Label</FormLabel>
        <StyledInput
          type="text"
          value={stagedLabel}
          onChange={handleChange}
        />
      </FieldContainer>
      <FieldContainer>
        <FormLabel>Business Object</FormLabel>
        <Select
          isDisabled={data.boId} // Can only specify underlying bo on create
          styles={{ container: base => ({ ...base, flex: 1 }) }}
          value={boOptions.find(({ value }) => value === stagedBusinessObjId)}
          onChange={({ value }) => setStagedBusinessObjId(value)}
          options={boOptions}
        />
      </FieldContainer>

      <StyledButton onClick={saveBom}>Submit</StyledButton>
    </>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  mutationVars: PropTypes.object,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  afterMutationHook: () => {},
  mutationVars: {},
}

export default Form
