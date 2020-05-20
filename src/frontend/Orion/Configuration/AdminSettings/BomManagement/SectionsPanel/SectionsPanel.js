import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import SectionPanelItem from './SectionPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
// import DeleteButton from '../shared/DeleteButton'
import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
  StyledNavHeader,
} from '../shared/styledComponents'

import {
  CREATE_BOM_CONFIG_SECTION,
} from 'frontend/api/mutations'

import { GET_BOM_CONFIGS } from 'frontend/api/queries'

const getSectionField = section => {
  const sectionId = section._id

  const firstField = section.fields[0]
  const fieldObj = firstField ? { fieldId: firstField._id } : {}

  return {
    sectionId,
    ...fieldObj,
  }
}

const SectionsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    bomId: selectedBomId,
    tabId: selectedTabId,
    sectionId: selectedSectionId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_BOM_CONFIGS)

  const handleClick = sectionObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, ...getSectionField(sectionObj) }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedBom = data.bomConfigs.find(({ _id }) => (
    _id === selectedBomId
  ))

  const tabs = selectedBom ? selectedBom.tags : []

  const selectedTab = tabs.find(({ _id }) => (
    _id === selectedTabId
  ))

  const sections = selectedTab ? selectedTab.sections : []

  return (
    <ListContainer style={{ width: '25%' }}>
      <ListHeader>
        <ListTitle>
          <span>Sections / </span>
          <StyledNavHeader>{(selectedTab || {}).label}</StyledNavHeader>
        </ListTitle>

        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_BOM_CONFIG_SECTION}
          mutationVars={{ modalId: selectedBomId, tagId: selectedTabId }}
          afterMutationHook={handleClick}
          modalTitle="Create Section"
        />
      </ListHeader>

      <StyledUnorderedList>
        {
          sections.map(sectionObj => (
            <SectionPanelItem
              key={sectionObj._id}
              isSelected={sectionObj._id === selectedSectionId}
              sectionLabel={sectionObj.label}
              handleClick={() => handleClick(sectionObj)}
            >
              {/* <ModalButtonWithForm
                buttonLabel="Edit"
                data={sheetObj}
                mutationDoc={UPDATE_SHEET}
                modalTitle="Create or Edit Sheet"
                mutationVars={{ workbookId: selectedSectionId }}
                afterMutationHook={handleClick}
                style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
              /> */}

              {/* <DeleteButton
                mutationVars={{ workbookId: selectedSectionId, sheetId: sheetObj._id }}
                mutationDoc={DELETE_SHEET}
                afterMutationHook={() => {
                  const targetWorkbook = data.workbooks.find(({ _id }) => _id === selectedSectionId)
                  const nextSheetSelection = targetWorkbook.sheets.find(({ _id }) => _id !== sheetObj._id)

                  handleClick(nextSheetSelection)
                }}
              /> */}
            </SectionPanelItem>
          ))
        }
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default SectionsPanel
