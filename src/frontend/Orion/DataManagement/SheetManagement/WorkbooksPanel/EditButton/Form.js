import React, { useState } from 'react'

const Form = ({
  data, // structure: { _id: 'asdf', workbook: 'asdfasdf' }
}) => {
  const [stagedWorkbookStr, setWorkbookStr] = useState(data.workbook)

  // const [updateWorkbook] = useMutation({
  //   variables: {
  //     input: { _id: data._id, workbook: data.workbook }
  //   }
  // })
  
  const handleChange = e => {
    e.persist()
    const value = e.currentTarget && e.currentTarget.value
    setWorkbookStr(value)
  }

  return (
    <div style={{ display: 'flex' }}>
      <label>Workbook</label>
      <input
        type="text"
        value={stagedWorkbookStr}
        onChange={handleChange}
      />
    </div>
  )
}

export default Form
