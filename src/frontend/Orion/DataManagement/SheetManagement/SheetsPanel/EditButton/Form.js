import React, { useState } from 'react'

const Form = ({
  data, // structure: { _id: 'asdf', workbook: 'asdfasdf' }
}) => {
  const [stagedSheetName, setSheetName] = useState(data.sheet)

  // const [updateWorkbook] = useMutation({
  //   variables: {
  //     input: { _id: data._id, workbook: data.workbook }
  //   }
  // })
  
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
    </div>
  )
}

export default Form
