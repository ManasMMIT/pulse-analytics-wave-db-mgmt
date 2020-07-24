import React, { useState, useRef } from 'react'
import { useMutation } from '@apollo/react-hooks'
import XLSX from 'xlsx'
import styled from '@emotion/styled'
import Select from 'react-select'

import { IMPORT_WORKBOOK } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import FieldLabel from 'frontend/components/FieldLabel'
import Title from 'frontend/components/Title'

import Spacing from 'frontend/utils/spacing'
import { customSelectStyles } from 'frontend/components/customSelectStyles'

const wrapperStyle = {
  width: '100%',
  margin: Spacing.S7,
  display: 'flex',
  flexDirection: 'column',
}

const importBtnStyle = {
  width: 'fit-content',
  marginBottom: Spacing.S7,
  marginTop: Spacing.S3,
}

const InputWrapper = styled.div({
  margin: Spacing.S3,
})

const VALID_SHEET_NAMES = ['State Lives', 'National Lives']

const PayerLivesImport = () => {
  const fileInputRef = useRef(null)

  const [workbook, setWorkbook] = useState(null)
  const [workbookName, setWorkbookName] = useState(null)
  const [isWorkbookUploaded, setIsWorkbookUploaded] = useState(false)
  const [sheet, selectSheet] = useState(null)
  const [sheetOptions, setSheetOptions] = useState([])
  const [source, selectSource] = useState(null)
  const [timestamp, setTimestamp] = useState(null)

  const [importWorkbook] = useMutation(IMPORT_WORKBOOK, {
    onError: alert,
    onCompleted: () => {
      alert('Import Successful')
      window.location.reload()
    },
  })

  const onFileAdded = () => {
    setIsWorkbookUploaded(false)
    const file = fileInputRef.current.files[0]
    const reader = new FileReader()
    setWorkbookName(file.name)

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { type: 'array' })

      const validSheets = nextWorkbook.SheetNames.filter((sheetName) =>
        VALID_SHEET_NAMES.includes(sheetName)
      )

      setSheetOptions(validSheets.map((name) => ({ label: name, value: name })))
      setWorkbook(nextWorkbook)
      setIsWorkbookUploaded(true)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDateSelection = (e) => {
    const yearMonth = e.target.value

    // Manually set first day of month for timestamp
    setTimestamp(yearMonth + '-01')
  }

  const handleRadioChecking = (e) => selectSource(e.target.value)

  const handleSubmit = () => {
    const selectedSheetObj = workbook.Sheets[sheet]
    const json = XLSX.utils.sheet_to_json(selectedSheetObj, {
      blankrows: true,
      defval: null,
    })

    const workbookData = [
      {
        wb:
          source === 'DRG'
            ? 'Payer DRG Lives Master'
            : 'Payer MMIT Lives Master',
        sheet,
        timestamp,
        territoryType: sheet === 'State Lives' ? 'U.S. State' : 'National',
        source,
        data: json,
      },
    ]

    console.log(workbookData)

    importWorkbook({ variables: { input: workbookData } })
  }

  const shouldDisableButton =
    !isWorkbookUploaded || !timestamp || !sheet || !source
  const buttonHoverStyle = {
    cursor: shouldDisableButton ? 'not-allowed' : 'pointer',
  }

  const sheetValue = sheet ? { label: sheet, value: sheet } : null

  return (
    <div style={wrapperStyle}>
      <Title
        titleStyle={{ paddingLeft: 0, paddingTop: 0 }}
        title={'Import Lives Data'}
        size={'FS3'}
      />
      <InputWrapper>
        <FieldLabel>Select File</FieldLabel>
        <label htmlFor="file-upload" className="custom-file-upload">
          {isWorkbookUploaded ? workbookName : 'Choose a File'}
        </label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileAdded}
        />
        <FieldLabel>Select Sheet</FieldLabel>
        <Select
          styles={customSelectStyles}
          placeholder={'Select a Sheet'}
          value={sheetValue}
          options={sheetOptions}
          onChange={({ value }) => selectSheet(value)}
        />
        <FieldLabel>Select Source</FieldLabel>
        <div
          style={{
            width: 200,
            margin: `${Spacing.S4} 0px`,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <input
              type="radio"
              name="data-source"
              value={'DRG'}
              onChange={handleRadioChecking}
            />
            <label style={{ marginLeft: Spacing.S3 }}>DRG</label>
          </div>
          <div>
            <input
              type="radio"
              name="data-source"
              value={'MMIT'}
              onChange={handleRadioChecking}
            />
            <label style={{ marginLeft: Spacing.S3 }}>MMIT</label>
          </div>
        </div>
        <FieldLabel>Select Timestamp</FieldLabel>
        <input
          type="month"
          value={timestamp && timestamp.split('-').slice(0, 2).join('-')}
          onChange={handleDateSelection}
        />
      </InputWrapper>
      <Button
        isDisabled={shouldDisableButton}
        buttonStyle={importBtnStyle}
        hoverStyle={buttonHoverStyle}
        onClick={handleSubmit}
      >
        Import File
      </Button>
    </div>
  )
}

export default PayerLivesImport
