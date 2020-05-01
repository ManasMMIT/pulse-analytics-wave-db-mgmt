import React, { useState, useRef } from "react"
import XLSX from 'xlsx'
import _ from 'lodash'

import Select from 'react-select'
import Spinner from '../../Phoenix/shared/Spinner'
import { UPLOAD_SHEET } from '../../api/mutations'

import { useMutation } from '@apollo/react-hooks'

import Button from '../../components/Button'
import { customSelectStyles } from '../../components/customSelectStyles'
import FontSpace from '../../utils/fontspace'
import Color from '../../utils/color'


import {
  PageContainer,
  PageHeaderContainer,
  PageHeader,
  ImportFormContainer,
  FieldContainer,
  FieldLabel,
  FileInput,
  ErrorContainer,
} from './styledImportComponents'

const Import = () => {
  const fileInputRef = useRef(null)

  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, selectSheet] = useState(null)
  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)

  const [uploadSheet] = useMutation(UPLOAD_SHEET, {
    onCompleted: ({ uploadSheet: importFeedback }) => {
      alert(importFeedback.join('\n'))
      setLoading(false)
    },
    onError: errorMessage => {
      alert(errorMessage)
      setLoading(false)
      setErrors(errorMessage.toString())
    },
  })

  const onFileAdded = () => {
    setLoading(true)

    const file = fileInputRef.current.files[0]

    const reader = new FileReader()

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { cellDates: true, type: 'array' })

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
    <PageContainer>
      <PageHeaderContainer>
        <PageHeader>Import Excel Sheets</PageHeader>
      </PageHeaderContainer>
        
        <div style={{ padding: '24px 0 0 36px', color: Color.RED, ...FontSpace.FS3 }}>
          <ul style={{ listStyle: 'circle' }}>
            <li>Second and third rows are always skipped</li>
            <li>If an error message says "should be null,number", it means cell should either be empty or in the format specified</li>
          </ul>
        </div>

      <ImportFormContainer>
        <FieldContainer>
          <FieldLabel>Pick an Excel file:</FieldLabel>
          <FileInput
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileAdded}
          />
        </FieldContainer>

        {
          _.isEmpty(sheetNames) || (
            <FieldContainer style={{ width: 500 }}>
              <FieldLabel>Sheets to Upload:</FieldLabel>
              {
                <Select
                  value={selectedSheet}
                  onChange={obj => selectSheet(obj)}
                  options={sheetNames.map(n => ({ value: n, label: n }))}
                  styles={customSelectStyles}
                />
              }
            </FieldContainer>
          )
        }

        {
          selectedSheet && (
            <Button onClick={handleSubmit}>
              Import Sheet
            </Button>
          )
        }

        { loading && <Spinner /> }

        {
          errors && (
            <ErrorContainer>
              { errors }
            </ErrorContainer>
          )
        }
      </ImportFormContainer>
    </PageContainer>
  )
}

export default Import
