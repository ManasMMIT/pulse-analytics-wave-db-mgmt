import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
// import _ from 'lodash'

import TabPanelItem from './TabPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
  StyledNavHeader,
} from '../shared/styledComponents'

import {
  CREATE_BOM_CONFIG_TAB,
  DELETE_BOM_CONFIG_TAB,
  UPDATE_BOM_CONFIG_TAB,
} from '../../../../../api/mutations'

import { GET_BOM_CONFIGS } from '../../../../../api/queries'

const getTabSectionField = tabObj => {
  const tabId = tabObj._id

  const firstSection = tabObj.sections[0]
  const sectionId = firstSection._id

  const firstField = firstSection.fields[0]
  const fieldObj = firstField ? { fieldId: firstField._id } : {}

  return {
    tabId,
    sectionId,
    ...fieldObj,
  }
}

const TabsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    bomId: selectedBomId,
    tabId: selectedTabId,
  } = (
    location.search
    && queryString.parse(location.search)
  ) || {}

  const { data, loading } = useQuery(GET_BOM_CONFIGS)

  const handleClick = tabObj => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = { ...prevQueryParams, ...getTabSectionField(tabObj) }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  if (loading) return 'Loading...'

  const selectedBom = data.bomConfigs.find(({ _id }) => (
    _id === selectedBomId
  ))

  const tabs = selectedBom ? selectedBom.tags : []

  return (
    <ListContainer style={{  width: '25%' }}>
      <ListHeader>
        <ListTitle>
          <span>Tabs / </span>
          <StyledNavHeader>{(selectedBom || {}).label}</StyledNavHeader>
        </ListTitle>
        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_BOM_CONFIG_TAB}
          mutationVars={{ modalId: selectedBomId }}
          afterMutationHook={handleClick}
          modalTitle="Create Tab"
        />
      </ListHeader>

      <StyledUnorderedList>
        {
          tabs.map(tabObj => (
            <TabPanelItem
              key={tabObj._id}
              isSelected={tabObj._id === selectedTabId}
              tabLabel={tabObj.label}
              handleClick={() => handleClick(tabObj)}
            >
              <ModalButtonWithForm
                buttonLabel="Edit"
                data={tabObj}
                mutationDoc={UPDATE_BOM_CONFIG_TAB}
                modalTitle="Edit Tab"
                mutationVars={{ modalId: selectedBomId, tagId: selectedTabId }}
                afterMutationHook={handleClick}
                style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
              />

              <DeleteButton
                mutationVars={{ modalId: selectedBomId, tagId: selectedTabId }}
                mutationDoc={DELETE_BOM_CONFIG_TAB}
                afterMutationHook={() => {
                  const nextTabSelection = tabs.find(({ _id }) => _id !== tabObj._id)

                  handleClick(nextTabSelection)
                }}
              />
            </TabPanelItem>
          ))
        }
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default TabsPanel
