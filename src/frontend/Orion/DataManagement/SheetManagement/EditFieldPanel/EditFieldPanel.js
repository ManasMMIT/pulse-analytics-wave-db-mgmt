import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import _ from 'lodash'

import Form from './Form'
import { GET_WORKBOOKS } from '../../../../api/queries'

const EditFieldPanel = () => {
  const location = useLocation()

  const {
    workbookId: selectedWorkbookId,
    sheetId: selectedSheetId,
    fieldId: selectedFieldId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_WORKBOOKS)

  if (loading) return 'Loading...'

  const selectedWorkbook = data.workbooks.find(({ _id }) => (
    _id === selectedWorkbookId
  ))

  const sheets = selectedWorkbook ? selectedWorkbook.sheets : []

  const selectedSheet = sheets.find(({ _id }) => (
    _id === selectedSheetId
  ))

  const fields = selectedSheet ? selectedSheet.fields : []

  const selectedField = fields.find(({ _id }) => (
    _id === selectedFieldId
  ))

  if (!selectedField) return 'Loading...'

  return (
    <ul style={{ listStyle: 'none' }}>
      <Form
        key={selectedField._id}
        data={_.omit(selectedField, ['__typename'])}
      />
    </ul>
  )
}

export default EditFieldPanel
