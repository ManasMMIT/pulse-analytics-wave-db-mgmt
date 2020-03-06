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

  const [saveWorkbook] = useMutation(mutationDoc, {
    variables: {
      input: { ...mutationVars, sheetId: data._id, name: stagedSheetName }
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
  
  const handleChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setSheetName(value)
  }

  return (
    <div style={{ display: 'flex' }}>
      <label>Sheet Name</label>
      <input
        type="text"
        value={stagedSheetName}
        onChange={handleChange}
      />

      <button onClick={saveWorkbook}>submit</button>
    </div>
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
