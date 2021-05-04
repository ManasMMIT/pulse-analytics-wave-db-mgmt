import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { UPDATE_LISTS_CONFIG } from 'frontend/api/mutations'

import StructuralListPanels from 'frontend/components/StructuralListPanels'

import ListsConfigSearchBar from './ListsConfigSearchBar'
import DashboardToolPanel from './DashboardToolPanel'
import UpdateListItemPanel from './UpdateListItemPanel'

import LISTS_CONFIG_PANELS from './lists-config-panels'

const ListsConfigManagement = () => {
  const location = useLocation()

  const {
    dashboardTool: selectedDashboardTool,
    listsConfigId: selectedListsConfigId,
  } = (location.search && queryString.parse(location.search)) || {}

  const { data, loading, error } = useQuery(GET_LISTS_CONFIG, {
    variables: { dashboardTool: selectedDashboardTool },
  })

  const [updateListItemsMutation] = useMutation(UPDATE_LISTS_CONFIG, {
    onError: alert,
  })

  const updateListItemsOnSortEnd = (newListItems) => {
    newListItems = newListItems.map(({ __typename, ...rest }) => rest)

    const input = {
      _id: selectedListsConfigId,
      labelKeys: newListItems,
    }

    updateListItemsMutation({ variables: { input } })
  }

  let listsConfigs = []
  const firstDataKey = !loading && !error && Object.keys(data)[0]
  if (selectedDashboardTool && firstDataKey) {
    listsConfigs = data[firstDataKey]
  }
  LISTS_CONFIG_PANELS[0].data = listsConfigs
  LISTS_CONFIG_PANELS[0].loading = loading
  LISTS_CONFIG_PANELS[0].error = error

  let listItems = []
  let listItemsListHeaderTitle = ''
  if (selectedListsConfigId) {
    const listsConfig = listsConfigs.find(
      ({ _id }) => _id === selectedListsConfigId
    )
    if (listsConfig) {
      listItems = listsConfig.labelKeys
      listItemsListHeaderTitle = listsConfig.listId
      LISTS_CONFIG_PANELS[1].listConfig.sortableConfig.updateFunc = updateListItemsOnSortEnd
    }
  }
  LISTS_CONFIG_PANELS[1].data = listItems
  LISTS_CONFIG_PANELS[1].listHeaderConfig.title = listItemsListHeaderTitle
  LISTS_CONFIG_PANELS[1].loading = loading
  LISTS_CONFIG_PANELS[1].error = error

  const panelHeight = 'calc(100vh - 40px)'

  return (
    <div style={{ width: '100%' }}>
      <ListsConfigSearchBar />
      <div style={{ display: 'flex', height: panelHeight }}>
        <DashboardToolPanel />
        <StructuralListPanels
          panels={LISTS_CONFIG_PANELS}
          searchParamsAncestry={['dashboardTool']}
        />
        <UpdateListItemPanel />
      </div>
    </div>
  )
}

export default ListsConfigManagement
