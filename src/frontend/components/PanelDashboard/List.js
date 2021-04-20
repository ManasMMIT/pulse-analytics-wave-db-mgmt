import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const Wrapper = styled.div({}, ({ style }) => ({
  ...style,
}))

const List = ({ data, searchParamKey, ListItem, handleClick, style }) => {
  return (
    <Wrapper style={style}>
      {data.map((listItem) => (
        <ListItem
          key={listItem[searchParamKey]}
          data={listItem}
          handleClick={() => handleClick(listItem[searchParamKey])}
        />
      ))}
    </Wrapper>
  )
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  searchParamKey: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  style: PropTypes.object,
}

List.defaultProps = {
  style: {},
}

export default List
