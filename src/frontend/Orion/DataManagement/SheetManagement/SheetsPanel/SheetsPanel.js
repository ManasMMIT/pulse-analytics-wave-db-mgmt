import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import _ from 'lodash'

import SheetPanelItem from './SheetPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'

import { 
  CREATE_SHEET, 
  UPDATE_SHEET,
  DELETE_SHEET,
} from '../../../../api/mutations'

import { GET_WORKBOOKS } from '../../../../api/queries'

const getSheetFieldIds = sheetObj => {
  const sheetId = sheetObj._id

  const firstField = sheetObj.fields[0]
  const fieldId = firstField._id

  return {
    sheetId,
    fieldId,
  }
}

const SheetsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const { 
    sheetId: selectedSheetId, 
    workbookId: selectedWorkbookId,
  } = (
    location.search 
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_WORKBOOKS)

  const handleClick = sheetObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, ...getSheetFieldIds(sheetObj) }
    
    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedWorkbook = data.workbooks.find(({ _id }) => (
    _id === selectedWorkbookId
  ))

  const sheets = selectedWorkbook ? selectedWorkbook.sheets : []

  return (
    <div style={{ padding: 24 }}>
      <ModalButtonWithForm
        buttonLabel="Create Sheet"
        mutationDoc={CREATE_SHEET}
        mutationVars={{ workbookId: selectedWorkbookId }}
        afterMutationHook={handleClick}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {
          sheets.map(sheetObj => (
            <SheetPanelItem
              key={sheetObj._id}
              isSelected={sheetObj._id === selectedSheetId}
              sheetName={sheetObj.name}
              handleClick={() => handleClick(sheetObj)}
            >
              <ModalButtonWithForm 
                buttonLabel="Edit"
                data={sheetObj}
                mutationDoc={UPDATE_SHEET}
                mutationVars={{ workbookId: selectedWorkbookId }}
                afterMutationHook={handleClick}
              />

              <DeleteButton
                mutationVars={{ workbookId: selectedWorkbookId, sheetId: sheetObj._id }}
                mutationDoc={DELETE_SHEET}
                afterMutationHook={() => {
                  const targetWorkbook = data.workbooks.find(({ _id }) => _id === selectedWorkbookId)
                  const nextSheetSelection = targetWorkbook.sheets.find(({ _id }) => _id !== sheetObj._id)

                  handleClick(nextSheetSelection)
                }}
              />
            </SheetPanelItem>
          ))
        }
      </ul>
    </div>
  )
}

export default SheetsPanel
