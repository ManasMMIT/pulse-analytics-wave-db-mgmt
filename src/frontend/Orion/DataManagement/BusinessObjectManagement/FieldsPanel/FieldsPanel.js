import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
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

import { Colors } from '../../../../utils/pulseStyles'

import { GET_BUSINESS_OBJECTS } from '../../../../api/queries'

import {
  CREATE_BUSINESS_OBJECT_FIELD,
  UPDATE_SHEET_FIELD,
  DELETE_SHEET_FIELD,
 } from '../../../../api/mutations'

const FieldsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    businessObjectId: selectedBusinessObjectId,
    fieldId: selectedFieldId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_BUSINESS_OBJECTS)

  const handleClick = fieldObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, fieldId: fieldObj._id }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedBusinessObject = data.businessObjects.find(({ _id }) => (
    _id === selectedBusinessObjectId
  ))

  const fields = selectedBusinessObject ? selectedBusinessObject.fields : []

  const selectedField = fields.find(({ _id }) => (
    _id === selectedFieldId
  ))

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <ListContainer style={{ width: '100%' }}>
        <ListHeader>
          <ListTitle>Fields</ListTitle>
          <CreateButtonWithForm
            mutationDoc={CREATE_BUSINESS_OBJECT_FIELD}
            mutationVars={{
              businessObjectId: selectedBusinessObjectId,
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
                label={fieldObj.key}
                handleClick={() => handleClick(fieldObj)}
              >
                {/* <DeleteButton
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
                /> */}
              </FieldPanelItem>
            ))
          }
        </StyledUnorderedList>
      </ListContainer>

      <div style={{ width: '100%', background: Colors.LIGHT_BLUE_GRAY_2, }}>
        <UpdateFormLabel>Update Field</UpdateFormLabel>
        <UpdateForm
          key={selectedFieldId}
          data={selectedField}
          mutationDoc={UPDATE_SHEET_FIELD}
          // mutationVars={{
          //   fieldId: selectedFieldId,
          //   sheetId: selectedSheetId,
          //   workbookId: selectedWorkbookId,
          // }}
        />
      </div>
    </div>
  )
}

export default FieldsPanel
