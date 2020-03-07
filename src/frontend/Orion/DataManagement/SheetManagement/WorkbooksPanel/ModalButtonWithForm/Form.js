import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { GET_WORKBOOKS } from '../../../../../api/queries'

const Form = ({
  data,
  mutationDoc,
  afterMutationHook,
  closeModal,
}) => {
  const [stagedWorkbookStr, setWorkbookStr] = useState(data.name)

  const [saveWorkbook] = useMutation(mutationDoc, {
    variables: {
      input: { _id: data._id, name: stagedWorkbookStr }
    },
    refetchQueries: [{ query: GET_WORKBOOKS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedWorkbook = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedWorkbook)
    },
    awaitRefetchQueries: true,
  })
  
  const handleChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setWorkbookStr(value)
  }

  return (
    <>
      <div style={{ display: 'flex', padding: 8 }}>
        <label>Workbook Name</label>
        <input
          type="text"
          value={stagedWorkbookStr}
          onChange={handleChange}
        />
      </div>

      <button onClick={saveWorkbook}>submit</button>
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
