import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import queryString from 'query-string'

import FieldPanelItem from './FieldPanelItem'
import UpdateForm from './Form'
import CreateButtonWithForm from './CreateButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import {
  ListContainer,
  ListHeader,
  ListTitle,
  UpdateFormLabel,
  StyledUnorderedList,
} from '../shared/styledComponents'

import { Colors } from '../../../../../utils/pulseStyles'

import { GET_WORKBOOKS } from '../../../../../api/queries'

import {
  CREATE_SHEET_FIELD,
  UPDATE_SHEET_FIELD,
  DELETE_SHEET_FIELD,
} from '../../../../../api/mutations'

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
    <div style={{ display: 'flex', width: '50%' }}>
      <ListContainer style={{ width: '50%' }}>
        <ListHeader>
          <ListTitle>Fields</ListTitle>
          <CreateButtonWithForm
            mutationDoc={CREATE_SHEET_FIELD}
            mutationVars={{
              sheetId: selectedSheetId,
              workbookId: selectedWorkbookId,
            }}
            modalTitle='Create Field'
            afterMutationHook={handleClick}
          />
        </ListHeader>

        <StyledUnorderedList>
          {
            fields.map(fieldObj => (
              <FieldPanelItem
                key={fieldObj._id}
                isSelected={fieldObj._id === selectedFieldId}
                fieldName={fieldObj.name}
                handleClick={() => handleClick(fieldObj)}
              >
                <DeleteButton
                  mutationDoc={DELETE_SHEET_FIELD}
                  mutationVars={{
                    fieldId: selectedFieldId,
                    sheetId: selectedSheetId,
                    workbookId: selectedWorkbookId,
                  }}
                  afterMutationHook={() => {
                    const targetWorkbook = data.workbooks.find(({ _id }) => _id === selectedWorkbookId)
                    const targetSheet = targetWorkbook.sheets.find(({ _id }) => _id === selectedSheetId)
                    const nextFieldSelection = targetSheet.fields.find(({ _id }) => _id !== fieldObj._id)

                    handleClick(nextFieldSelection)
                  }}
                />
              </FieldPanelItem>
            ))
          }
        </StyledUnorderedList>
      </ListContainer>

      <div style={{ width: '50%', background: Colors.LIGHT_BLUE_GRAY_2, }}>
        <UpdateFormLabel>Update Field</UpdateFormLabel>
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
    </div>
  )
}

export default FieldsPanel
