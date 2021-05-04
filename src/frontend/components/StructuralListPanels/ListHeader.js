import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const DEFAULT_WRAPPER_STYLE = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
}

const DEFAULT_TITLE_STYLE = {}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const Title = styled.div(DEFAULT_TITLE_STYLE, ({ style }) => ({
  ...style,
}))

const ListHeader = ({
  title,
  CreateButton,
  handleClick,
  style,
  titleStyle,
}) => {
  return (
    <Wrapper style={style}>
      <Title style={titleStyle}>{title}</Title>
      <CreateButton handleClick={handleClick} />
    </Wrapper>
  )
}

ListHeader.propTypes = {
  title: PropTypes.string,
  CreateButton: PropTypes.elementType,
  handleClick: PropTypes.func,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
}

ListHeader.defaultProps = {
  title: '',
  CreateButton: () => null,
  handleClick: () => {},
  style: {},
  titleStyle: {},
}

export default ListHeader
