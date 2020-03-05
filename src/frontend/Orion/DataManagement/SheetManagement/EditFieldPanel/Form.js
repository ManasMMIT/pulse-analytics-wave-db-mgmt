import React, { useState } from 'react'
import Select from 'react-select'

const TYPES = [
  'string',
  'number',
  'integer',
  'boolean',
  'csv',
]

const Form = ({
  data, // structure: { _id: 'asdf', workbook: 'asdfasdf' }
}) => {
  const [stagedFieldName, setFieldName] = useState(data.field)
  const [stagedType, setType] = useState(data.type)
  const [stagedOneOf, setOneOf] = useState(data.oneOf || [])

  // const [updateWorkbook] = useMutation({
  //   variables: {
  //     input: { _id: data._id, workbook: data.workbook }
  //   }
  // })

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
    </div>
  )
}

export default Form
