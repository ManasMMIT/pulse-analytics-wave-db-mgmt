import React, { useState, useRef } from 'react'
import XLSX from 'xlsx'
import { transparentize } from 'polished'

import Select from 'react-select'
import Spinner from 'frontend/components/Spinner'
import { IMPORT_WORKBOOK } from '../../../api/mutations'

import { useMutation } from '@apollo/react-hooks'

import Button from '../../../components/Button'
import { customSelectStyles } from '../../../components/customSelectStyles'
import Color from '../../../utils/color'

import {
  PageContainer,
  ImportFormContainer,
  FieldContainer,
  FieldLabel,
  FileInput,
  ErrorContainer,
  CardHeader,
  CardSubHeader,
} from './styledImportComponents'

import ToolsTimestamps from './ToolsTimestamps'

const borderStyle = `1px solid ${transparentize(0.9, Color.BLACK)}`

const listItemStyle = {
  marginBottom: 8,
  marginTop: 8,
}

const Import = () => {
  const fileInputRef = useRef(null)

  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, selectSheet] = useState(null)
  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)

  const [importWorkbook] = useMutation(IMPORT_WORKBOOK, {
    onCompleted: ({ importWorkbook: importFeedback }) => {
      alert(importFeedback.join('\n'))
      setLoading(false)
    },
    onError: (errorMessage) => {
      alert(errorMessage)
      setLoading(false)
      setErrors(errorMessage.toString())
    },
  })

  const onFileAdded = () => {
    setLoading(true)

    const file = fileInputRef.current.files[0]

    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { cellDates: true, type: 'array' })

      const nextSheetNames = nextWorkbook.SheetNames
      const nextSelectedSheet = {
        value: nextSheetNames[0],
        label: nextSheetNames[0],
      }

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

    const json = XLSX.utils.sheet_to_json(selectedSheetObj, {
      blankrows: true,
      defval: null,
    })

    const fileName = fileInputRef.current.files[0].name
    const fileNameWithoutExt = fileName.replace('.xlsx', '')

    importWorkbook({
      variables: {
        input: [
          {
            wb: fileNameWithoutExt,
            sheet: selectedSheetName,
            data: json,
          },
        ],
      },
    })
  }

  return (
    <PageContainer>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, borderRight: borderStyle }}>
          <CardHeader style={{ paddingBottom: 0 }}>
            Import Excel Sheets
          </CardHeader>

          <ImportFormContainer>
            <FieldContainer>
              <FieldLabel>Pick an Excel file:</FieldLabel>
              <FileInput
                ref={fileInputRef}
                type="file"
                onChange={onFileAdded}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>Sheet to Upload:</FieldLabel>
              {
                <Select
                  value={selectedSheet}
                  onChange={(obj) => selectSheet(obj)}
                  options={sheetNames.map((n) => ({ value: n, label: n }))}
                  styles={customSelectStyles}
                />
              }
            </FieldContainer>

            <Button onClick={handleSubmit}>Import Sheet</Button>
          </ImportFormContainer>

          <div style={{ padding: '12px 24px 0', color: Color.PURPLE }}>
            <ul
              style={{
                listStyle: 'none',
                fontSize: 11,
                background: transparentize(0.9, Color.PURPLE),
                padding: '4px 12px',
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              <li style={listItemStyle}>
                Second and third rows are always skipped
              </li>
              <li style={listItemStyle}>
                If an error message says "should be null,number", it means cell
                should either be empty or in the format specified
              </li>
            </ul>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <CardHeader>Tool Last Updated Dates</CardHeader>
          <CardSubHeader>
            IMPORTANT: When updating the Tool Last Updated Dates, you must
            select the "Deploy Permissions" button on Phoenix for the changes to
            take effect on the Production Client Application.
          </CardSubHeader>
          <ToolsTimestamps />
        </div>
      </div>

      <div
        style={{
          flex: '1 0 0%',
          borderTop: borderStyle,
          padding: 24,
          overflow: 'auto',
        }}
      >
        {errors && (
          <div>
            <div
              style={{
                width: '100%',
                padding: 12,
                background: transparentize(0, Color.RED),
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ color: Color.WHITE, fontSize: 12, fontWeight: 700 }}>
                Import Failed:{' '}
                <span style={{ marginLeft: 12 }}>1) Fix errors below</span>{' '}
                <span style={{ marginLeft: 12 }}>2) Reload this page</span>{' '}
                <span style={{ marginLeft: 12 }}>3) Reimport</span>
              </h3>
              <p style={{ color: Color.WHITE, fontSize: 12, fontWeight: 400 }}>
                If the errors persist or are unable to resolve them, please
                contact PULSE
              </p>
            </div>
            <ErrorContainer>{errors}</ErrorContainer>
          </div>
        )}

        {loading && (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner size="32px" />
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: Color.BLUE,
                  marginTop: 8,
                }}
              >
                Loading...
              </p>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default Import
