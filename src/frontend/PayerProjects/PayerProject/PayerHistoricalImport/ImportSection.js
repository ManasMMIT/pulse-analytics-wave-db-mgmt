import React, { useState, useRef } from 'react'
import XLSX from 'xlsx'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Alert from '@material-ui/lab/Alert'

import { IMPORT_WORKBOOK } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import FieldLabel from 'frontend/components/FieldLabel'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'
import alertStatuses from 'frontend/utils/alertStatuses'

const { ERROR, INFO, SUCCESS } = alertStatuses

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

// TODO: Replace Input with input component
const InputWrapper = styled.div({
  margin: `${ Spacing.S7 } 0px`,
})

const LoadingWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const alertMessageMap = {
  success: 'Import Successful',
  error: 'Import Failed. Please try importing again',
  info: (
    <LoadingWrapper>
      <span style={{ marginRight: Spacing.S3 }}>
        Importing
      </span>
      <Spinner size={14} />
    </LoadingWrapper>
  )
}

const ImportSection = ({
  projectId,
  setValidationErrorsAndWarnings,
}) => {
  const fileInputRef = useRef(null)

  const [workbook, setWorkbook] = useState(null)
  const [isWorkbookUploaded, setIsWorkbookUploaded] = useState(false)
  const [sheetNames, setSheetNames] = useState([])
  const [timestamp, setTimestamp] = useState(null)
  const [alertStatus, setAlertStatus] = useState({
    status: null, message: null
  })
  
  const [importWorkbook] = useMutation(IMPORT_WORKBOOK, {
    onCompleted: ({ importWorkbook: importFeedback }) => {
      setAlertStatus({
        status: SUCCESS,
        message: alertMessageMap[SUCCESS]
      })
    },
    onError: (errorMessage, ...rest) => {
      setValidationErrorsAndWarnings(errorMessage.message)
      setAlertStatus({
        status: ERROR,
        message: alertMessageMap[ERROR]
      })
    },
  })

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
    const workbookData = []
    
    sheetNames.forEach(sheet => {
      const selectedSheetObj = workbook.Sheets[sheet]
      const json = XLSX.utils.sheet_to_json(selectedSheetObj, { blankrows: true, defval: null })

      workbookData.push({
        wb: 'Payer Data Master',
        sheet,
        data: json,
        timestamp,
        projectId
      })
    })

    console.log(workbookData)

    setAlertStatus({
      status: INFO,
      message: alertMessageMap[INFO]
    })

    importWorkbook({ variables: { input: workbookData } })
  }

  const shouldDisableButton = !isWorkbookUploaded || !timestamp
  const buttonHoverStyle = { cursor: shouldDisableButton ? 'not-allowed' : 'pointer' }

  return (
    <ImportSectionWrapper>
      <Header>Import Data</Header>
      <InputWrapper>
        <FieldLabel>Pick an Excel File</FieldLabel>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileAdded}
        />
      </InputWrapper>
      <InputWrapper>
        <FieldLabel>Select Timestamp</FieldLabel>
        <input
          type="date"
          id="select-timestamp"
          name="select-timestamp"
          onChange={handleDateSelection}
        />
      </InputWrapper>
      <Button
        buttonStyle={{ width: 'fit-content', marginBottom: Spacing.S7 }}
        hoverStyle={buttonHoverStyle}
        onClick={handleSubmit}
      >
        Import File
      </Button>
      {alertStatus.status && (
        <Alert severity={alertStatus.status}>
          { alertStatus.message }
        </Alert>
      )}
    </ImportSectionWrapper>
  )
}

ImportSection.propTypes = {
  projectId: PropTypes.string.isRequired,
  setValidationErrorsAndWarnings: PropTypes.func.isRequired,
}

export default ImportSection
