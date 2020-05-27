import React, { useState, useRef } from 'react'
import XLSX from 'xlsx'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Alert from '@material-ui/lab/Alert'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles"
import { IMPORT_WORKBOOK } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import FieldLabel from 'frontend/components/FieldLabel'
import Spinner from 'frontend/components/Spinner'
import Icon from 'frontend/components/Icon'
import Title from 'frontend/components/Title'

import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import alertStatuses from 'frontend/utils/alertStatuses'

import './importSection.css'

const { ERROR, INFO, SUCCESS } = alertStatuses

const ImportSectionWrapper = styled.div({
  display: 'flex',
  width: '50%',
  padding: Spacing.S7,
  flexDirection: 'column',
  borderRight: `1px solid ${ Color.LIGHT_GRAY_1 }`,
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
})

const InputWrapper = styled.div({
  margin: `${ Spacing.S3 } 0px`,
})

const LoadingWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const importBtnStyle = {
  width: 'fit-content',
  marginBottom: Spacing.S7,
  marginTop: Spacing.S3
}

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

const VALID_SHEETS = {
  'Quality of Access': true,
  'Additional Criteria': true,
  'Policy Links': true,
}

const datePickerTheme = createMuiTheme({
  palette: {
    primary: {
      main: Color.PRIMARY,
    }
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%',
      }
    }
  }
})

const ImportSection = ({
  projectId,
  projectName,
  setValidationErrorsAndWarnings,
}) => {
  const fileInputRef = useRef(null)

  const [workbook, setWorkbook] = useState(null)
  const [workbookName, setWorkbookName] = useState(null)
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
    setWorkbookName(file.name)

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { type: 'array' })
      
      let nextSheetNames = nextWorkbook.SheetNames
      nextSheetNames = nextSheetNames.filter(sheetName => VALID_SHEETS[sheetName])

      if (nextSheetNames.length !== 3) {
        if (window.confirm(`Workbook doesn't have required sheets: ${Object.keys(VALID_SHEETS).join(', ')}. Make sure workbook includes those sheets (exact naming), refresh, try again.`)) {
          window.location.reload()
        }
      } else {
        setSheetNames(nextSheetNames)
        setWorkbook(nextWorkbook)
        setIsWorkbookUploaded(true)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDateSelection = (date) => {
    setTimestamp(date)
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
      <Title
        titleStyle={{ paddingLeft: 0, paddingTop: 0 }}
        title={'Import Data'}
        titleModifiers={[projectName]}
        size={'FS3'}
      />
      <InputWrapper>
        <FieldLabel>Select File</FieldLabel>
        <label htmlFor="file-upload" className="custom-file-upload">
          { isWorkbookUploaded ? workbookName : 'Choose a File' }
        </label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileAdded}
        />
      </InputWrapper>
      <InputWrapper>
        <FieldLabel>Select Timestamp</FieldLabel>
        <ThemeProvider theme={datePickerTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              id="date-picker-inline"
              label="MM/dd/yyyy"
              style={{ borderBottom: 'none' }}
              value={timestamp}
              onChange={handleDateSelection}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              keyboardIcon={<Icon iconName="arrow-drop-down"/>}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </InputWrapper>
      <Button
        buttonStyle={importBtnStyle}
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
