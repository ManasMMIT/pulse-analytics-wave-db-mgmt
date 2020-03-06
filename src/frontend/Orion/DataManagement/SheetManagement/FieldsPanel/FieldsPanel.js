import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import FieldPanelItem from './FieldPanelItem'
import UpdateForm from './Form'
import CreateButtonWithForm from './CreateButtonWithForm'

import { GET_WORKBOOKS } from '../../../../api/queries'

import { 
  CREATE_SHEET_FIELD,
  UPDATE_SHEET_FIELD,
  DELETE_SHEET_FIELD,
 } from '../../../../api/mutations'

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

  const selectedField = fields.find(({ _id }) => (
    _id === selectedFieldId
  ))

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <CreateButtonWithForm
          mutationDoc={CREATE_SHEET_FIELD}
          mutationVars={{
            sheetId: selectedSheetId,
            workbookId: selectedWorkbookId,
          }}
          afterMutationHook={handleClick}
        />
        
        <ul style={{ listStyle: 'none' }}>
          {
            fields.map(fieldObj => (
              <FieldPanelItem
                key={fieldObj._id}
                isSelected={fieldObj._id === selectedFieldId}
                fieldName={fieldObj.name}
                handleClick={() => handleClick(fieldObj)}
              />
            ))
          }
        </ul>
      </div>

      <UpdateForm
        key={selectedFieldId}
        data={selectedField} 
        mutationDoc={UPDATE_SHEET_FIELD}
        mutationVars={{
          fieldId: selectedFieldId,
          sheetId: selectedSheetId,
          workbookId: selectedWorkbookId,
        }}
      />
    </div>
  )
}

export default FieldsPanel
