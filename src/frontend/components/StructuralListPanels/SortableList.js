import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import './sortableContainerStyles.css'

const DEFAULT_WRAPPER_STYLE = {}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const SortableContainer = sortableContainer(({ style, children }) => {
  return <Wrapper style={style}>{children}</Wrapper>
})

const SortableList = ({
  data,
  ListItem,
  searchParamKey,
  selectedListItem,
  handleClick,
  placeholder,
  updateFunc,
  style,
}) => {
  const SortableListItem = sortableElement((props) => {
    return <ListItem {...props} />
  })

  const [stagedListItems, setListItems] = useState(data)

  useEffect(() => {
    setListItems(data)
  }, [data])

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const tempListItems = stagedListItems
    const [removedItem] = tempListItems.splice(oldIndex, 1)
    tempListItems.splice(newIndex, 0, removedItem)

    setListItems(tempListItems)
    updateFunc(tempListItems)
  }

  const isPlaceholderSelected = ({ key }) => selectedListItem === key

  return (
    <SortableContainer
      onSortEnd={onSortEnd}
      helperClass="sortableHelper"
      useDragHandle
      style={style}
    >
      {stagedListItems.map((listItem, index) => {
        const isSelected = listItem[searchParamKey] === selectedListItem

        return (
          <SortableListItem
            key={listItem[searchParamKey]}
            index={index}
            data={listItem}
            isSelected={isSelected}
            handleClick={handleClick}
            searchParamKey={searchParamKey}
          />
        )
      })}
      {placeholder && isPlaceholderSelected(placeholder) && (
        <ListItem
          data={placeholder.data}
          isSelected={true}
          handleClick={() => {}}
        />
      )}
    </SortableContainer>
  )
}

SortableList.propTypes = {
  ListItem: PropTypes.elementType.isRequired,
  searchParamKey: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  data: PropTypes.array,
  selectedListItem: PropTypes.string,
  placeholder: PropTypes.object,
  updateFunc: PropTypes.func,
  style: PropTypes.object,
}

SortableList.defaultProps = {
  data: [],
  selectedListItem: null,
  placeholder: null,
  updateFunc: () => null,
  style: {},
}

export default SortableList
