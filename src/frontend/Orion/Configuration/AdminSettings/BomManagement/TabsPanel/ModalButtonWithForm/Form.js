import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useMutation } from '@apollo/client'
import _ from 'lodash'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

import {
  GET_BOM_CONFIGS,
  GET_BOM_SCHEMA,
} from '../../../../../../api/queries'

const Form = ({
  data,
  mutationDoc,
  afterMutationHook,
  closeModal,
  mutationVars,
  selectedBom,
}) => {
  const [stagedTabLabel, setTabLabel] = useState(data.label)

  const [saveTab] = useMutation(mutationDoc, {
    variables: {
      input: { label: stagedTabLabel, ...mutationVars }
    },
    refetchQueries: [{ query: GET_BOM_CONFIGS }, { query: GET_BOM_SCHEMA, variables: { boId: selectedBom.boId } }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedTab = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedTab)
    },
    awaitRefetchQueries: true,
  })

  const handleChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setTabLabel(value)
  }

  return (
    <>
      <FieldContainer>
        <FormLabel>Label</FormLabel>
        <StyledInput
          type="text"
          value={stagedTabLabel}
          onChange={handleChange}
        />
      </FieldContainer>
      <StyledButton onClick={saveTab}>Submit</StyledButton>
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
  afterMutationHook: () => { },
}

export default Form
