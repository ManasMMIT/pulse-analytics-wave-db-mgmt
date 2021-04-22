import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { Colors } from 'frontend/utils/pulseStyles'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'
import { UPDATE_LISTS_CONFIG } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
  StyledNavHeader,
  StyledButton,
} from '../shared/styledComponents'

import { NEW_LIST_ITEM } from '../utils'
import ListItemPanelItem from './ListItemPanelItem'

import './sortableContainerStyles.css'

const LIST_ITEMS_PANEL_LABEL = 'List Items / '
const CREATE_BUTTON_LABEL = '+'

const spinnerDiv = (
  <div style={{ textAlign: 'center', marginTop: 100 }}>
    <Spinner />
  </div>
)

const getListItemKey = (listItemObj) => {
  return listItemObj ? { listItemKey: listItemObj.labelKey } : {}
}

const SortableContainer = sortableContainer(({ children }) => {
  return <StyledUnorderedList>{children}</StyledUnorderedList>
})

const SortablePanelItem = sortableElement((props) => {
  return <ListItemPanelItem {...props} />
})

const ListItemsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const {
    dashboardTool: selectedDashboardTool,
    listsConfigId: selectedListsConfigId,
    listItemKey: selectedListItemKey,
  } = (location.search && queryString.parse(location.search)) || {}

  const { data, loading } = useQuery(GET_LISTS_CONFIG, {
    variables: { input: { dashboardTool: selectedDashboardTool } },
  })

  const handleClick = (listItemObj) => {
    const nextParams = {
      dashboardTool: selectedDashboardTool,
      ...(selectedListsConfigId
        ? { listsConfigId: selectedListsConfigId }
        : {}),
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

  const [stagedListItems, setListItems] = useState(selectedListItems)

  /*
    When loading initially completes or list changes in Lists Panel,
    set first list item if a list is selected.
  */
  useEffect(() => {
    if (selectedListsConfigId && !selectedListItemKey && !loading)
      handleClick(selectedListItems[0])
  }, [loading, selectedListsConfigId, selectedListItemKey])

  /*
    Update state list items when they are changed.
    This is needed because we use both cache and state.
  */
  useEffect(() => {
    if (!loading) setListItems(selectedListItems)
  }, [loading, selectedList])

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newListItems = stagedListItems.map(({ __typename, ...rest }) => rest)

    const [removedItem] = newListItems.splice(oldIndex, 1)
    newListItems.splice(newIndex, 0, removedItem)

    const input = {
      _id: selectedListsConfigId,
      labelKeys: newListItems,
    }

    updateListItemsMutation({ variables: { input } })
    setListItems(newListItems)
  }

  const listContent = loading ? (
    spinnerDiv
  ) : (
    <SortableContainer
      onSortEnd={onSortEnd}
      helperClass="sortableHelper"
      useDragHandle
    >
      {stagedListItems.map((listItemObj, index) => (
        <SortablePanelItem
          key={listItemObj.labelKey}
          index={index}
          isSelected={listItemObj.labelKey === selectedListItemKey}
          listItemLabelKey={listItemObj.labelKey}
          listItemLabelName={listItemObj.labelName}
          handleClick={() => handleClick(listItemObj)}
        />
      ))}
      {selectedListItemKey === NEW_LIST_ITEM.labelKey && (
        <ListItemPanelItem
          key={NEW_LIST_ITEM.labelKey}
          isSelected={true}
          listItemLabelKey={NEW_LIST_ITEM.labelKey}
          listItemLabelName={NEW_LIST_ITEM.labelName}
          handleClick={() => handleClick(NEW_LIST_ITEM)}
          style={{
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: Colors.PRIMARY,
            borderRadius: '5px',
          }}
        />
      )}
    </SortableContainer>
  )

  return (
    <ListContainer style={{ flex: 1 }}>
      <ListHeader>
        <ListTitle>
          <span>{LIST_ITEMS_PANEL_LABEL}</span>
          <StyledNavHeader>{(selectedList || {}).listId}</StyledNavHeader>
        </ListTitle>
        <StyledButton
          onClick={() => handleClick(NEW_LIST_ITEM)}
          disabled={!selectedListsConfigId || loading}
        >
          {CREATE_BUTTON_LABEL}
        </StyledButton>
      </ListHeader>

      {listContent}
    </ListContainer>
  )
}

export default ListItemsPanel
