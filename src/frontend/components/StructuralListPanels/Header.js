import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const DEFAULT_WRAPPER_STYLE = {
  alignItems: 'center',
  display: 'flex',
}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const Header = ({ title, style }) => {
  return <Wrapper style={style}>{title}</Wrapper>
}

Header.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
}

Header.defaultProps = {
  title: '',
  style: {},
}

export default Header
