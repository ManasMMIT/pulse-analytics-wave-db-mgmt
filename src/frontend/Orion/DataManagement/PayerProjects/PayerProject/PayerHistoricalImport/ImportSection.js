import React, { useState, useRef } from 'react'
import XLSX from 'xlsx'
import PropTypes from 'prop-types'

import styled from '@emotion/styled'

import Spacing from '../../../../../utils/spacing'
import FontSpace from '../../../../../utils/fontspace'
import Color from '../../../../../utils/color'

const ImportSectionWrapper = styled.div({
  display: 'flex',
  width: '50%',
  padding: Spacing.S7,
  flexDirection: 'column',
  borderRight: `1px solid ${ Color.LIGHT_GRAY_1 }`,
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
})

const Header = styled.h1({
  ...FontSpace.FS4
})

// TODO: Replace with button component
const Button = styled.button({
  color: Color.WHITE,
  backgroundColor: Color.BLUE,
  ...FontSpace.FS2,
  padding: `${ Spacing.S2 } ${ Spacing.S3 }`,
  borderRadius: '4px',
  fontWeight: 500,
  width: 'fit-content',
  ':hover': {
    opacity: 0.6,
  }
}, ({ disabled }) => ({
  ':hover': {
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}))

// TODO: Replace Input with input component
const InputWrapper = styled.div({
  margin: `${ Spacing.S7 } 0px`,
})

const ImportSection = ({
  projectId
}) => {
  const fileInputRef = useRef(null)

  const [workbook, setWorkbook] = useState(null)
  const [isWorkbookUploaded, setIsWorkbookUploaded] = useState(false)
  const [sheetNames, setSheetNames] = useState([])
  const [timestamp, setTimestamp] = useState(null)
  
  const onFileAdded = () => {
    setIsWorkbookUploaded(false)
    const file = fileInputRef.current.files[0]
    const reader = new FileReader()

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { type: 'array' })
      
      const nextSheetNames = nextWorkbook.SheetNames

      setSheetNames(nextSheetNames)
      setWorkbook(nextWorkbook)
      setIsWorkbookUploaded(true)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDateSelection = (e) => {
    setTimestamp(e.target.value)
  }

  const handleSubmit = () => {
    const fileName = fileInputRef.current.files[0].name
    const fileNameWithoutExt = fileName.replace('.xlsx', '')
    
    const sheetData = []
    
    sheetNames.forEach(sheet => {
      const selectedSheetObj = workbook.Sheets[sheet]
      const json = XLSX.utils.sheet_to_json(selectedSheetObj, { blankrows: true, defval: null })

      sheetData.push({
        wb: fileNameWithoutExt,
        sheet,
        data: json,
        timestamp,
        projectId
      })
    })

    // TODO: Wire in import mutation
    console.log(sheetData)
  }

  const shouldDisableButton = !isWorkbookUploaded || !timestamp

  return (
    <ImportSectionWrapper>
      <Header>Import Data</Header>
      <InputWrapper>
        <b>Pick an Excel file:</b>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileAdded}
          />
        </div>
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="select-timestamp"><b>Select Timestamp</b></label>
        <div>
          <input
            type="date"
            id="select-timestamp"
            name="select-timestamp"
            onChange={handleDateSelection}
          />
        </div>
      </InputWrapper>
      <Button
        disabled={shouldDisableButton}
        onClick={handleSubmit}
      >
        Import File
      </Button>
    </ImportSectionWrapper>
  )
}

ImportSection.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default ImportSection