import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

import {
  GET_BUSINESS_OBJECTS,
  GET_BOM_CONFIGS,
  GET_BOM_SCHEMA,
} from '../../../../../../api/queries'

const Form = ({
  data,
  mutationDoc,
  afterMutationHook,
  closeModal,
  mutationVars,
}) => {
  const [stagedBomLabel, setBomLabel] = useState(data.label)

  // Make this null on mount because even if this is the update form,
  // we don't know the bo name needed in the react-select label
  // 'till after bo is fetched; another reason to not store react-select's
  // formatting in React local state
  const [stagedBusinessObj, setStagedBusinessObj] = useState(null)

  const boId = (stagedBusinessObj || {}).value

  const [saveBom] = useMutation(mutationDoc, {
    variables: {
      input: { ...mutationVars, label: stagedBomLabel, boId },
    },
    refetchQueries: [
      { query: GET_BOM_CONFIGS },
      { query: GET_BOM_SCHEMA, variables: { boId } },
    ],
    onCompleted: (result) => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedBomConfig = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedBomConfig)
    },
    awaitRefetchQueries: true,
    onError: (e) => alert(e),
  })

  const { data: businessObjData, loading } = useQuery(GET_BUSINESS_OBJECTS)

  useEffect(() => {
    if (!loading) {
      const { businessObjects } = businessObjData

      let stagedBo = {
        label: businessObjects[0].name,
        value: businessObjects[0]._id,
      }

      if (data.boId) {
        const underlyingBo = businessObjects.find(
          ({ _id }) => _id === data.boId
        )

        stagedBo = { label: underlyingBo.name, value: underlyingBo._id }
      }

      setStagedBusinessObj(stagedBo)
    }
  }, [businessObjData, loading])

  if (loading) return null

  const handleChange = (e) => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setBomLabel(value)
  }

  const boOptions = businessObjData.businessObjects.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  return (
    <>
      <FieldContainer>
        <FormLabel>Label</FormLabel>
        <StyledInput
          type="text"
          value={stagedBomLabel}
          onChange={handleChange}
        />
      </FieldContainer>
      <FieldContainer>
        <FormLabel>Business Object</FormLabel>
        <Select
          isDisabled={data.boId} // Can only specify underlying bo on create
          styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          value={stagedBusinessObj}
          defaultValue={boOptions[0]}
          onChange={setStagedBusinessObj}
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
