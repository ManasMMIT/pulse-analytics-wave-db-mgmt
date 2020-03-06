import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import _ from 'lodash'

import WorkbookPanelItem from './WorkbookPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from './../shared/DeleteButton'

import { 
  CREATE_WORKBOOK,
  UPDATE_WORKBOOK,
  DELETE_WORKBOOK,
} from '../../../../api/mutations'

import { GET_WORKBOOKS } from '../../../../api/queries'

const getWorkbookSheetFieldIds = wb => {
  const workbookId = wb._id

  const firstSheet = wb.sheets[0]
  const sheetId = firstSheet._id

  const firstField = firstSheet.fields[0]
  const fieldId = firstField._id

  return {
    workbookId,
    sheetId,
    fieldId,
  }
}

const WorkbooksPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedWorkbookId = (
    location.search 
      && queryString.parse(location.search)
      && queryString.parse(location.search).workbookId
  ) || ''

  const { data, loading } = useQuery(GET_WORKBOOKS)

  const handleClick = workbookObj => {
    history.push({
      search: queryString.stringify(
        getWorkbookSheetFieldIds(workbookObj)
      ),
    })
  }
  
  useEffect(() => {
    if (!selectedWorkbookId && !loading) {
      const firstWb = data.workbooks[0]  
      handleClick(firstWb)
    }
  }, [loading])

  if (loading) return 'Loading...'

  return (
    <div>
      <ModalButtonWithForm 
        buttonLabel="Create Workbook"
        mutationDoc={CREATE_WORKBOOK}
        afterMutationHook={handleClick}
      />

      <ul style={{ listStyle: 'none' }}>
        {
          data.workbooks.map(workbookObj => (
            <WorkbookPanelItem 
              key={workbookObj._id}
              isSelected={workbookObj._id === selectedWorkbookId}
              workbookName={workbookObj.name} 
              handleClick={() => handleClick(workbookObj)}
            >
              <ModalButtonWithForm 
                buttonLabel="Edit" 
                data={workbookObj}
                mutationDoc={UPDATE_WORKBOOK}
                afterMutationHook={handleClick}
              />

              <DeleteButton
                mutationVars={{ _id: workbookObj._id }}
                mutationDoc={DELETE_WORKBOOK}
                afterMutationHook={() => {
                  const nextWorkbookSelection = data.workbooks.find(({ _id }) => _id !== workbookObj._id)
                  handleClick(nextWorkbookSelection)
                }}
              />
            </WorkbookPanelItem>
          ))
        }
      </ul>
    </div>
  )
}

export default WorkbooksPanel
