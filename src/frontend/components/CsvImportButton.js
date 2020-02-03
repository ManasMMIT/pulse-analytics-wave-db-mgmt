import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import XLSX from 'xlsx'

import Spinner from './../Phoenix/shared/Spinner'

import {
  UPSERT_ORGANIZATION_META,
} from './../api/mutations'

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

const CsvImportButton = ({
  onClick,
}) => {
  const [data, setData] = useState(null)
  const [isImportingData, setIsImportingData]= useState(false)

  const [writeMetaData] = useMutation(UPSERT_ORGANIZATION_META, {
    variables: {
      input: {
        action: 'import',
        _ids: (data || []).map(({ _id }) => _id),
      }
    }
  })

  return (
    <div>
      <input
        id="provider-csv-input"
        style={{ display: 'block' }}
        type="file"
        onClick={e => {
          e.target.value = null
          setData(null)
        }}
        onChange={e => onFileAdded(e, setData)}
      />
      <button
        style={{ margin: '12px 0px' }}
        disabled={!data}
        onClick={() => {
          setIsImportingData(true)

          onClick(data).then(() => {
            const input = document.querySelector('#provider-csv-input')
  
            input.value = null

            writeMetaData()

            setData(null)
            setIsImportingData(false)
          })
          .catch(err => {
            setIsImportingData(false)
            console.error(err)
          })
        }}
      >
        Import File
      </button>
      {
        isImportingData
          ? <Spinner />
          : null
      }
    </div>
  )
}

CsvImportButton.propTypes = {
  onClick: PropTypes.func,
}

CsvImportButton.defaultProps = {
  onClick: () => {},
}

export default CsvImportButton
