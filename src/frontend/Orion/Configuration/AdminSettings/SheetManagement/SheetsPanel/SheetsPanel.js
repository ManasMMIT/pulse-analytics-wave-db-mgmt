import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import queryString from 'query-string'
import _ from 'lodash'

import SheetPanelItem from './SheetPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from '../shared/styledComponents'

import {
  CREATE_SHEET,
  UPDATE_SHEET,
  DELETE_SHEET,
} from '../../../../../api/mutations'

import { GET_WORKBOOKS } from '../../../../../api/queries'

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
    <ListContainer style={{ width: '25%' }}>
      <ListHeader>
        <ListTitle>Sheets</ListTitle>
        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_SHEET}
          mutationVars={{ workbookId: selectedWorkbookId }}
          afterMutationHook={handleClick}
          modalTitle="Create or Edit Sheet"
        />
      </ListHeader>

      <StyledUnorderedList>
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
                modalTitle="Create or Edit Sheet"
                mutationVars={{ workbookId: selectedWorkbookId }}
                afterMutationHook={handleClick}
                style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
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
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default SheetsPanel
