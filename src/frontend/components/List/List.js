import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const ListContainer = styled.div({
  overflowY: 'auto',
})

const List = ({ children }) => <ListContainer>{children}</ListContainer>

List.propTypes = {
  children: PropTypes.node,
}

List.defaultProps = {
  children: null,
}

export default List
