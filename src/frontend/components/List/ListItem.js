import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { transparentize } from 'polished'

import Color from 'frontend/utils/color'

const ListItemContainer = styled.li({
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  listStyleType: 'none',
})

const ListItem = ({ children, style, value, clickHandler }) => (
  <ListItemContainer style={style} onClick={() => clickHandler(value)}>
    {children}
  </ListItemContainer>
)

ListItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  value: PropTypes.any,
  clickHandler: PropTypes.func,
}

ListItem.defaultProps = {
  children: null,
  style: {},
  value: null,
  clickHandler: () => {},
}

export default ListItem
