import React, { useState, useRef, useEffect } from 'react'
import XLSX from 'xlsx'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { Alert, AlertTitle } from '@material-ui/lab'
import socket from 'frontend/api/socket'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { IMPORT_WORKBOOK } from 'frontend/api/mutations'
import { darken } from 'polished'

import Button from 'frontend/components/Button'
import FieldLabel from 'frontend/components/FieldLabel'
import Spinner from 'frontend/components/Spinner'
import Icon from 'frontend/components/Icon'
import Title from 'frontend/components/Title'

import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import alertStatuses from 'frontend/utils/alertStatuses'
import { formatDateMonthYearDash } from 'frontend/utils/formatDate'

import './importSection.css'

const { ERROR, INFO, SUCCESS } = alertStatuses

const ImportSectionWrapper = styled.div({
  display: 'flex',
  width: '50%',
  padding: Spacing.S7,
  flexDirection: 'column',
  borderRight: `1px solid ${Color.LIGHT_GRAY_1}`,
  borderBottom: `1px solid ${Color.LIGHT_GRAY_1}`,
})

const InputWrapper = styled.div({
  margin: `${Spacing.S3} 0px`,
})

const LoadingWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const ImportLogContainer = styled.div({
  background: darken(0.03, Color.TOOL_SIDEBAR),
  borderRadius: 4,
  whiteSpace: 'pre-line',
  padding: 12,
  marginTop: 12,
  color: Color.WHITE,
})

const ImportLogTitle = styled.h6({
  fontSize: 12,
  fontWeight: 800,
  marginTop: 0,
  marginBottom: 12,
  opacity: 0.5,
})

const ImportLogText = styled.p({
  fontSize: 12,
  fontWeight: 600,
})

const importBtnStyle = {
  width: 'fit-content',
  marginBottom: Spacing.S7,
  marginTop: Spacing.S3,
}

const alertMessageMap = {
  success: 'Import Successful',
  error:
    'Import Failed. See errors in the table below. Once fixed, reload the page and try again.',
  info: (
    <LoadingWrapper>
      <span style={{ marginRight: Spacing.S3 }}>Importing</span>
      <Spinner size={14} />
    </LoadingWrapper>
  ),
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
    },
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
  },
})

const DEFAULT_ALERT_STATUS = {
  status: null,
  message: null,
  description: null,
}

const DEFAULT_NOTIFICATION = '✅ Good to import'

const ImportSection = ({
  projectId,
  projectName,
  setValidationErrorsAndWarnings,
}) => {
  const fileInputRef = useRef(null)

  const [notification, setNotification] = useState(DEFAULT_NOTIFICATION)
  const [workbook, setWorkbook] = useState(null)
  const [workbookName, setWorkbookName] = useState(null)
  const [isWorkbookUploaded, setIsWorkbookUploaded] = useState(false)
  const [sheetNames, setSheetNames] = useState([])
  const [timestamp, setTimestamp] = useState(null)
  const [alertStatus, setAlertStatus] = useState(DEFAULT_ALERT_STATUS)

  // Add Reload warning
  const beforeunload = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload)

    return () => {
      window.removeEventListener('beforeunload', beforeunload)
    }
  }, [])

  useEffect(() => {
    socket.on('PAYER_DATA_IMPORT', setNotification)
  }, [])

  useEffect(() => {
    if (notification.includes('is importing')) {
      setAlertStatus({
        status: INFO,
        message: alertMessageMap[INFO],
        description:
          'Compiling data for the app. This process usually takes around 2 ½ to 3 minutes. Once this process completes, visit or reload dev.pulse-tools.com.',
      })
    } else if (notification.includes('finished importing')) {
      setAlertStatus({
        status: SUCCESS,
        message: alertMessageMap[SUCCESS],
      })

      setTimeout(() => {
        setAlertStatus(DEFAULT_ALERT_STATUS)
        setNotification(DEFAULT_NOTIFICATION)
      }, 30000)
    } else if (notification.includes('error')) {
      // this setAlertStatus should happen right before onError in the mutation;
      // and is meant to allow OTHER USERS to press import on their data
      // if the current user's import fails (for current user, import will remain
      // disabled); if in worst case due to race condition this op happens after onError,
      // the consequence would be import button re-appears for current user
      setAlertStatus(DEFAULT_ALERT_STATUS)
    }
  }, [notification])

  const [importWorkbook] = useMutation(IMPORT_WORKBOOK, {
    onError: (errorMessage, ...rest) => {
      setValidationErrorsAndWarnings(errorMessage.message)
      setAlertStatus({
        status: ERROR,
        message: alertMessageMap[ERROR],
      })
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

      let nextSheetNames = nextWorkbook.SheetNames
      nextSheetNames = nextSheetNames.filter(
        (sheetName) => VALID_SHEETS[sheetName]
      )

      if (nextSheetNames.length !== 3) {
        if (
          window.confirm(
            `Workbook doesn't have required sheets: ${Object.keys(
              VALID_SHEETS
            ).join(
              ', '
            )}. Make sure workbook includes those sheets (exact naming), refresh, try again.`
          )
        ) {
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
    const formattedDate = formatDateMonthYearDash(date)
    setTimestamp(formattedDate)
  }

  const handleSubmit = () => {
    const workbookData = []

    sheetNames.forEach((sheet) => {
      const selectedSheetObj = workbook.Sheets[sheet]
      const json = XLSX.utils.sheet_to_json(selectedSheetObj, {
        blankrows: true,
        defval: null,
      })

      workbookData.push({
        wb: 'Payer Data Master',
        sheet,
        data: json,
        timestamp,
        projectId,
      })
    })

    console.log(workbookData)

    importWorkbook({ variables: { input: workbookData } })
  }

  const shouldDisableButton = !isWorkbookUploaded || !timestamp
  const buttonHoverStyle = {
    cursor: shouldDisableButton ? 'not-allowed' : 'pointer',
  }

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
          {isWorkbookUploaded ? workbookName : 'Choose a File'}
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
              keyboardIcon={<Icon iconName="arrow-drop-down" />}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </InputWrapper>

      {[ERROR, INFO].includes(alertStatus.status) || (
        <Button
          buttonStyle={importBtnStyle}
          hoverStyle={buttonHoverStyle}
          onClick={handleSubmit}
        >
          Import File
        </Button>
      )}

      {alertStatus.status && (
        <Alert severity={alertStatus.status}>
          <AlertTitle style={{ fontSize: 12, fontWeight: 700 }}>
            {alertStatus.message}
          </AlertTitle>
          <div style={{ fontSize: 12, lineHeight: 1.5, fontWeight: 400 }}>
            {alertStatus.description}
          </div>
        </Alert>
      )}

      <ImportLogContainer>
        <ImportLogTitle>Import System Status</ImportLogTitle>
        <ImportLogText>{notification}</ImportLogText>
      </ImportLogContainer>
    </ImportSectionWrapper>
  )
}

ImportSection.propTypes = {
  projectId: PropTypes.string.isRequired,
  setValidationErrorsAndWarnings: PropTypes.func.isRequired,
}

export default ImportSection
