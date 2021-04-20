import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const Wrapper = styled.div(
  {
    alignItems: 'center',
    display: 'flex',
  },
  ({ style }) => ({
    ...style,
  })
)

const Header = ({ label, style }) => {
  return <Wrapper style={style}>{label}</Wrapper>
}

Header.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
}

Header.defaultProps = {
  style: {},
}

export default Header
