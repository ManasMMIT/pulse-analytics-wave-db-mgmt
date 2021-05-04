import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'

import { DeleteButton } from './Buttons'
import Form from './Form'
import { UpdateFormLabel } from '../shared/styledComponents'
import { Colors } from 'frontend/utils/pulseStyles'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { UPDATE_LISTS_CONFIG } from 'frontend/api/mutations'
import { NEW_LIST_ITEM, updateListItems } from '../utils'

const UPDATE_LIST_ITEM_TITLE = 'Update List Item'

const DELETE_MODAL_TITLE = 'Delete List Item'

const getListItemKey = (listItemObj) => {
  return listItemObj ? { listItemKey: listItemObj.labelKey } : {}
}

const getDeleteModalText = (listItem) => {
  const labelNameString = listItem.labelName ? `, ${listItem.labelName}` : ``

  return `You are about to delete ${
    listItem.labelKey + labelNameString
  }. Are you sure?`
}

const UpdateListItemPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    dashboardTool: selectedDashboardTool,
    listsConfigId: selectedListsConfigId,
    listItemKey: selectedListItemKey,
  } = (location.search && queryString.parse(location.search)) || {}

  const { data, loading } = useQuery(GET_LISTS_CONFIG, {
    variables: { dashboardTool: selectedDashboardTool },
  })

  const handleClick = (listItemObj) => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = {
      ...prevQueryParams,
      ...getListItemKey(listItemObj),
    }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  const [updateListItemsMutation] = useMutation(UPDATE_LISTS_CONFIG, {
    onError: alert,
  })

  const selectedList =
    !loading &&
    data.listsConfig.find(({ _id }) => _id === selectedListsConfigId)

  const selectedListItems = (selectedList && selectedList.labelKeys) || []

  const selectedListItem =
    selectedListItemKey === NEW_LIST_ITEM.labelKey
      ? NEW_LIST_ITEM
      : selectedListItems.find(
          ({ labelKey }) => labelKey === selectedListItemKey
        )

  const existingLabelKeys = selectedListItems.map(({ labelKey }) => labelKey)
  const invalidLabelKeys = [...existingLabelKeys, NEW_LIST_ITEM.labelKey, '']

  const deleteListItem = (labelKeyToFilter) => {
    let newListItems = selectedListItems.map(({ __typename, ...rest }) => rest)

    newListItems = newListItems.filter(
      (listItem) => listItem.labelKey !== labelKeyToFilter
    )

    const input = {
      _id: selectedListsConfigId,
      labelKeys: newListItems,
    }

    updateListItemsMutation({ variables: { input } })

    const nextListItemSelection = newListItems.find(
      ({ labelKey }) => labelKey !== labelKeyToFilter
    )

    handleClick(nextListItemSelection)
  }

  const updateListItemsPanel = updateListItems(
    selectedListItems,
    selectedListItemKey,
    selectedListsConfigId,
    updateListItemsMutation,
    handleClick
  )

  const panelHeight = 'calc(100vh - 40px)'

  const panelStyle = {
    height: panelHeight,
    minHeight: panelHeight,
    maxHeight: panelHeight,
  }

  return (
    <div
      style={{ flex: 1, background: Colors.LIGHT_BLUE_GRAY_2, ...panelStyle }}
    >
      <UpdateFormLabel>{UPDATE_LIST_ITEM_TITLE}</UpdateFormLabel>
      {selectedListItem && selectedListItemKey !== NEW_LIST_ITEM.labelKey && (
        <DeleteButton
          modalTitle={DELETE_MODAL_TITLE}
          modalText={getDeleteModalText(selectedListItem)}
          deleteFunc={() => deleteListItem(selectedListItemKey)}
        />
      )}
      <Form
        key={selectedListItemKey}
        data={selectedListItem}
        invalidLabelKeys={invalidLabelKeys}
        mutationFunc={updateListItemsPanel}
      />
    </div>
  )
}

export default UpdateListItemPanel
