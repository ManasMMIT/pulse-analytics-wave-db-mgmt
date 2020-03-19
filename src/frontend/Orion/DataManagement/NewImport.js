import React, { useState, useRef } from "react"
import XLSX from 'xlsx'
import _ from 'lodash'

import Select from 'react-select'
import Spinner from '../../Phoenix/shared/Spinner'
import { UPLOAD_SHEET } from '../../api/mutations'

import { useMutation } from '@apollo/react-hooks'

const Import = () => {
  const fileInputRef = useRef(null)

  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, selectSheet] = useState(null)
  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)

  const [uploadSheet] = useMutation(UPLOAD_SHEET, {
    onCompleted: ({ uploadSheet: importFeedback }) => {
      alert(importFeedback.join('\n'))
      setLoading(false)
    },
    onError: alert,
  })

  const onFileAdded = () => {
    setLoading(true)

    const file = fileInputRef.current.files[0]

    const reader = new FileReader()

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { type: 'array' })

      const nextSheetNames = nextWorkbook.SheetNames
      const nextSelectedSheet = { value: nextSheetNames[0], label: nextSheetNames[0] }

      setWorkbook(nextWorkbook)
      setSheetNames(nextSheetNames)
      selectSheet(nextSelectedSheet)
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = () => {
    setLoading(true)

    const selectedSheetName = selectedSheet.value
    const selectedSheetObj = workbook.Sheets[selectedSheetName]

    const json = XLSX.utils.sheet_to_json(selectedSheetObj, { blankrows: true, defval: null })

    const fileName = fileInputRef.current.files[0].name
    const fileNameWithoutExt = fileName.replace('.xlsx', '')

    uploadSheet({
      variables: {
        input: [
          {
            wb: fileNameWithoutExt,
            sheet: selectedSheetName,
            data: json,
          }
        ]
      },
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <div>
        <p>Pick an Excel file:</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileAdded}
        />
      </div>

      {
        _.isEmpty(sheetNames) || (
          <div style={{ marginTop: 24, width: 500 }}>
            <p>Sheets to Upload:</p>
            {
              <Select
                value={selectedSheet}
                onChange={obj => selectSheet(obj)}
                options={sheetNames.map(n => ({ value: n, label: n }))}
              />
            }
          </div>
        )
      }

      {
        selectedSheet && (
          <button onClick={handleSubmit}>
            Import
          </button>
        )
      }

      { loading && <Spinner /> }
    </div>
  )
}

export default Import
