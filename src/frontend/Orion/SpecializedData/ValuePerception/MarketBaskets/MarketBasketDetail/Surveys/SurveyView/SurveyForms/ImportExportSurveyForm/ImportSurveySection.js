import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import XLSX from 'xlsx'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import socket from 'frontend/api/socket'
import { IMPORT_MARKET_BASKET_SURVEY } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

import { InputSection, FormLabel } from '../utils'
import { TextSection } from './ExportSurveySection'

const Container = styled.div({
  background: Color.GRAY_LIGHT,
  width: '50%',
  padding: Spacing.S7,
})

const onFileAdded = (e, setData) => {
  const file = e.currentTarget.files[0]

  const reader = new FileReader()

  reader.onload = (e) => {
    const arrayData = new Uint8Array(e.target.result)

    const workbook = XLSX.read(arrayData, { type: 'array' })
    const sheetNames = workbook.SheetNames

    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
      blankrows: false,
      defval: null,
    })

    setData(data)
  }

  reader.readAsArrayBuffer(file)
}

const DEFAULT_NOTIFICATION = '✅ Good to import survey'
const SOCKET_PROJECT_ID = 'IMPORT_MB_SURVEY_DATA'
const SUCCESS_NOTIFICATION = 'finished importing market basket survey data'

const ImportSurveySection = ({ surveyId }) => {
  const { marketBasketId } = useParams()
  const [data, setData] = useState(null)
  const [errors, setErrors] = useState(null)
  const [notification, setNotification] = useState(null)
  const socketEmitId = `${SOCKET_PROJECT_ID}_${surveyId}`
  socket.on(socketEmitId, setNotification)

  const input = {
    marketBasketId,
    surveyId,
    data,
  }

  const [importMarketBasketSurvey, { loading: isImportingData }] = useMutation(
    IMPORT_MARKET_BASKET_SURVEY,
    {
      variables: { input },
      onError: (errorMessage) => {
        setErrors(errorMessage.message)
        alert(errorMessage)
      },
    }
  )

  if (errors) {
    const parsedErrors = JSON.parse(errors.replace('GraphQL error: ', ''))

    const errorMessages = parsedErrors.map(
      ({ rowIdx, column, error: { errorMessage, value, suggestion } }) => (
        <div>{`Error ${rowIdx}${column}: ${errorMessage}. Value given was ${value}. Did you mean ${suggestion}?`}</div>
      )
    )

    return <div>{errorMessages}</div>
  }

  let importStatus = DEFAULT_NOTIFICATION
  const isImportFinished = new RegExp(SUCCESS_NOTIFICATION).test(notification)
  if (notification && !isImportFinished) {
    importStatus = (
      <>
        <Spinner />
        {notification}
      </>
    )
  }

  // ! claire TODO: disable import button when data is not ready
  return (
    <Container>
      <h3>Import Survey</h3>
      <TextSection>Imported edited survey responses.</TextSection>
      <InputSection>
        <FormLabel>Select File</FormLabel>
        <input
          style={{ display: 'block' }}
          type="file"
          onClick={(e) => {
            e.target.value = null
            setData(null)
          }}
          onChange={(e) => onFileAdded(e, setData)}
        />
      </InputSection>
      <Button
        onClick={importMarketBasketSurvey}
        style={{
          padding: `${Spacing.S2} ${Spacing.S3}`,
          margin: `${Spacing.S4} 0`,
          ...FontSpace.FS2,
        }}
      >
        {isImportingData ? <Spinner /> : 'Import Survey'}
      </Button>
      <div>
        {importStatus}
      </div>
    </Container>
  )
}

ImportSurveySection.propTypes = {
  surveyId: PropTypes.string.isRequired,
}

export default ImportSurveySection
