import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'

import { GET_WORKBOOKS } from '../../../../api/queries'

const TYPES = [
  'string',
  'number',
  'integer',
  'boolean',
  'csv',
]

const Form = ({ 
  data, 
  afterMutationHook,
  mutationDoc,
  fieldId,
  sheetId, 
  workbookId,
  closeModal,
}) => {
  const [stagedFieldName, setFieldName] = useState(data.name)
  const [stagedType, setType] = useState(data.type)
  const [stagedOneOf, setOneOf] = useState(data.oneOf || [])

  const [saveField] = useMutation(mutationDoc, {
    variables: {
      input: { 
        fieldId,
        sheetId,
        workbookId, 
        name: stagedFieldName,
        type: stagedType,
        oneOf: stagedOneOf, 
      }
    },
    refetchQueries: [{ query: GET_WORKBOOKS }],
    onCompleted: result => {
      const targetDataKey = Object.keys(result)[0]
      const newOrUpdatedField = result[targetDataKey]

      closeModal()
      afterMutationHook(newOrUpdatedField)
    },
    awaitRefetchQueries: true,
  })

  const handleTypeSelection = obj => setType(obj.value)

  const handleOneOfChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    const oneOfArr = value.split(',').map(str => str.trim())
    setOneOf(oneOfArr)
  }
  
  const handleFieldChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setFieldName(value)
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <label>Field Name</label>
        <input
          type="text"
          value={stagedFieldName}
          onChange={handleFieldChange}
        />
      </div>

      <div style={{ display: 'flex' }}>
        <label>Field Type</label>
        
        <Select
          styles={{ container: base => ({ ...base, flex: 1 }) }}
          value={{ value: stagedType, label: stagedType }}
          defaultValue={TYPES[0]}
          onChange={handleTypeSelection}
          options={TYPES.map(type => ({ value: type, label: type }))}
        />
      </div>

      <div>
        <div>oneOf Restrictions</div>
        <textarea
          style={{ width: 200, height: 200 }}
          value={stagedOneOf.join(', ')}
          onChange={handleOneOfChange}
        />
      </div>

      <button onClick={saveField}>submit</button>
    </div>
  )
}

Form.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  closeModal: PropTypes.func,
  fieldId: PropTypes.string,
  sheetId: PropTypes.string,
  workbookId: PropTypes.string,
}

Form.defaultProps = {
  data: {},
  mutationDoc: null,
  afterMutationHook: () => {},
  closeModal: () => {},
}

export default Form
