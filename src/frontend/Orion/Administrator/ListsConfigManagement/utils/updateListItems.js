import { NEW_LIST_ITEM } from './new-list-item'

/*
  Gets list items to be updated. If creating a new list item, then the new list item is added to the array.
  If updating a list item, then the list item is updated in the array.
  The list items are updated for the selected list, and the query string is updated to the updated list item.
*/
export const updateListItems = (
  selectedListItems,
  selectedListItemId,
  selectedListId,
  updateListItemsMutation,
  handleClick
) => {
  return (newListItem, labelKeyToReplace) => {
    let newListItems = selectedListItems.map(({ __typename, ...rest }) => rest)

    if (selectedListItemId === NEW_LIST_ITEM.labelKey) {
      newListItems = [...newListItems, newListItem]
    } else {
      newListItems = newListItems.map((listItem) =>
        listItem.labelKey === labelKeyToReplace ? newListItem : listItem
      )
    }

    const input = {
      _id: selectedListId,
      labelKeys: newListItems,
    }

    updateListItemsMutation({ variables: { input } })
    handleClick(newListItem)
  }
}
