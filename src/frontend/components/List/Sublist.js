import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const SublistContainer = styled.ul({
  padding: 0,
})

const Sublist = ({ children, style }) => {
  return <SublistContainer style={style}>{children}</SublistContainer>
}

Sublist.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
}

Sublist.defaultProps = {
  children: null,
  style: {},
}

export default Sublist
