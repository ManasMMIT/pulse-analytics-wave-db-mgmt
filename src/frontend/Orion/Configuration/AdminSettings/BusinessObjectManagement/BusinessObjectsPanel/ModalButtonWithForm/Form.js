import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  FieldContainer,
  FormLabel,
  StyledInput,
  StyledButton,
} from '../../shared/styledComponents'

import { GET_BUSINESS_OBJECTS } from '../../../../../../api/queries'

const Form = ({
  data,
  mutationDoc,
  afterMutationHook,
  closeModal,
}) => {
  const [stagedName, setStagedName] = useState(data.name)
  const [stagedSourceColl, setStagedSourceColl] = useState(
    data.sourceCollection && data.sourceCollection.collection
  )

  const input = _.isEmpty(data)
    ? {
        name: stagedName,
        sourceCollection: stagedSourceColl,
      }
    : {
        _id: data._id,
        name: stagedName,
        sourceCollection: stagedSourceColl
      }

  const [saveBusinessObject] = useMutation(mutationDoc, {
    variables: { input },
    refetchQueries: [{ query: GET_BUSINESS_OBJECTS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedBusinessObject = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedBusinessObject)
    },
    onError: e => {
      alert(e)
    },
    awaitRefetchQueries: true,
  })

  const handleNameChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value

    setStagedName(value)
  }

  const handleSourceCollChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value

    setStagedSourceColl(value)
  }

  return (
    <>
      <FieldContainer>
        <FormLabel>Name</FormLabel>
        <StyledInput
          type="text"
          value={stagedName}
          onChange={handleNameChange}
        />
        <FormLabel>Source Collection</FormLabel>
        <StyledInput
          type="text"
          value={stagedSourceColl}
          onChange={handleSourceCollChange}
        />
      </FieldContainer>

      <StyledButton onClick={saveBusinessObject}>Submit</StyledButton>
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
