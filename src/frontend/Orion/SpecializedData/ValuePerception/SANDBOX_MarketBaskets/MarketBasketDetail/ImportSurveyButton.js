import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import XLSX from 'xlsx'

import Spinner from 'frontend/components/Spinner'

import {
  IMPORT_MARKET_BASKET_SURVEY,
} from 'frontend/api/mutations'

const onFileAdded = (e, setData) => {
  const file = e.currentTarget.files[0]

  const reader = new FileReader()

  reader.onload = e => {
    const arrayData = new Uint8Array(e.target.result)

    const workbook = XLSX.read(arrayData, { type: 'array' })
    const sheetNames = workbook.SheetNames

    const data = XLSX
      .utils
      .sheet_to_json(
        workbook.Sheets[sheetNames[0]],
        { blankrows: false, defval: null }
      )

    setData(data)
  }

  reader.readAsArrayBuffer(file)
}

const ImportSurveyButton = ({
  surveyId,
}) => {
  const { marketBasketId } = useParams()
  const [data, setData] = useState(null)

  const input = {
    marketBasketId,
    surveyId,
    data,
  }

  const [
    importMarketBasketSurvey,
    { loading: isImportingData },
  ] = useMutation(
    IMPORT_MARKET_BASKET_SURVEY,
    { variables: { input } }
  )

  return (
    <div style={{ display: 'flex', margin: 12, alignItems: 'center' }}>
      <input
        style={{ display: 'block' }}
        type="file"
        onClick={e => {
          e.target.value = null
          setData(null)
        }}
        onChange={e => onFileAdded(e, setData)}
      />
      <button
        style={{ margin: 12 }}
        disabled={!data}
        onClick={importMarketBasketSurvey}
      >
        {
          isImportingData
            ? <Spinner />
            : 'Import File'
        }
      </button>
    </div>
  )
}

ImportSurveyButton.defaultProps = {
  surveyId: '123',
}

export default ImportSurveyButton
