import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import ListsPanelItem from './ListsPanelItem'
import { CreateButton, UpdateButton } from './Buttons'
import DeleteButton from './../shared/DeleteButton'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from './../shared/styledComponents'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'

import { DELETE_LISTS_CONFIG } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

const LISTS_PANEL_LABEL = 'Lists'

const spinnerDiv = (
  <div style={{ textAlign: 'center', marginTop: 100 }}>
    <Spinner />
  </div>
)

const getListsConfigId = (listsConfig) => {
  return listsConfig ? { listsConfigId: listsConfig._id } : {}
}

const getDeleteModalText = (listsConfig) => {
  const nodeIdString = listsConfig.nodeId ? `, ${listsConfig.nodeId}` : ``
  const listTitleString = listsConfig.listTitle
    ? `, ${listsConfig.listTitle}`
    : ``
  return `You are about to delete ${
    listsConfig.listId + nodeIdString + listTitleString
  }. Are you sure?`
}

const ListsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    dashboardTool: selectedDashboardTool,
    listsConfigId: selectedListsConfigId,
  } = (location.search && queryString.parse(location.search)) || {}

  const { data, loading } = useQuery(GET_LISTS_CONFIG, {
    variables: { input: { dashboardTool: selectedDashboardTool } },
  })

  const handleClick = (listsConfig) => {
    const nextParams = {
      dashboardTool: selectedDashboardTool,
      ...getListsConfigId(listsConfig),
    }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  useEffect(() => {
    if (!selectedListsConfigId && !loading) {
      const firstListsConfig = data.listsConfig[0]

      handleClick(firstListsConfig)
    }
  }, [loading, selectedDashboardTool, selectedListsConfigId])

  const listsConfigs = (!loading && data.listsConfig) || []

  const listContent = loading ? (
    spinnerDiv
  ) : (
    <StyledUnorderedList>
      {listsConfigs.map((listsConfig) => (
        <ListsPanelItem
          key={listsConfig._id}
          listsConfigListId={listsConfig.listId}
          listsConfigNodeId={listsConfig.nodeId}
          listsConfigTitle={listsConfig.listTitle}
          isSelected={listsConfig._id === selectedListsConfigId}
          handleClick={() => handleClick(listsConfig)}
        >
          <UpdateButton
            data={listsConfig}
            modalTitle="List Info"
            style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
          />
          <DeleteButton
            modalTitle={'Delete List'}
            modalText={getDeleteModalText(listsConfig)}
            mutationVars={{ _id: listsConfig._id }}
            mutationDoc={DELETE_LISTS_CONFIG}
            afterMutationHook={() => {
              const nextListSelection = data.listsConfig.find(
                ({ _id }) => _id !== listsConfig._id
              )
              handleClick(nextListSelection)
            }}
          />
        </ListsPanelItem>
      ))}
    </StyledUnorderedList>
  )

  return (
    <ListContainer style={{ flex: 1 }}>
      <ListHeader>
        <ListTitle>{LISTS_PANEL_LABEL}</ListTitle>
        <CreateButton afterMutationHook={handleClick} modalTitle="List Info" />
      </ListHeader>

      {listContent}
    </ListContainer>
  )
}

export default ListsPanel
