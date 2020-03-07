import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { GET_WORKBOOKS } from '../../../../../api/queries'

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
      <div style={{ display: 'flex', padding: 8 }}>
        <label>Sheet Name</label>
        <input
          type="text"
          value={stagedSheetName}
          onChange={handleSheetNameChange}
        />
      </div>

      <div style={{ display: 'flex', padding: 8 }}>
        <label>Collection Name</label>
        <input
          type="text"
          value={stagedCollectionName}
          onChange={handleCollectionNameChange}
        />
      </div>

      <button onClick={saveSheet}>submit</button>
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
