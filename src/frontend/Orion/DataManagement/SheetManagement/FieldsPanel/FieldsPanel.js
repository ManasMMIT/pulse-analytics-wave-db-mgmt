import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import FieldPanelItem from './FieldPanelItem'
import { GET_WORKBOOKS } from '../../../../api/queries'

const FieldsPanel = () => {
  const history = useHistory()
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

  const handleClick = fieldObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, fieldId: fieldObj._id }
    
    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedWorkbook = data.workbooks.find(({ _id }) => (
    _id === selectedWorkbookId
  ))

  const sheets = selectedWorkbook ? selectedWorkbook.sheets : []

  const selectedSheet = sheets.find(({ _id }) => (
    _id === selectedSheetId
  ))

  const fields = selectedSheet ? selectedSheet.fields : []

  return (
    <ul style={{ listStyle: 'none' }}>
      {
        fields.map(fieldObj => (
          <FieldPanelItem
            key={fieldObj._id}
            isSelected={fieldObj._id === selectedFieldId}
            fieldName={fieldObj.field}
            handleClick={() => handleClick(fieldObj)}
          />
        ))
      }
    </ul>
  )
}

export default FieldsPanel
