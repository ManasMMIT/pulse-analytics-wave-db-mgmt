import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const DEFAULT_WRAPPER_STYLE = {}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const List = ({
  data,
  ListItem,
  searchParamKey,
  selectedListItem,
  handleClick,
  placeholder,
  style,
}) => {
  const isPlaceholderSelected = ({ key }) => selectedListItem === key

  return (
    <Wrapper style={style}>
      {data.map((listItem) => {
        const isSelected = listItem[searchParamKey] === selectedListItem

        return (
          <ListItem
            key={listItem[searchParamKey]}
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
    </Wrapper>
  )
}

List.propTypes = {
  ListItem: PropTypes.elementType.isRequired,
  searchParamKey: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  data: PropTypes.array,
  selectedListItem: PropTypes.string,
  placeholder: PropTypes.object,
  style: PropTypes.object,
}

List.defaultProps = {
  data: [],
  selectedListItem: null,
  placeholder: null,
  style: {},
}

export default List
