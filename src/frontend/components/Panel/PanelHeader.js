import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 100, // ! should be sourced from centralized style-guide file in the future
})

const Title = styled.div({
  color: Color.BLACK,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.2px',
  padding: 24,
  textTransform: 'uppercase',
})

const PanelHeader = ({ headerContainerStyle, title, titleStyle, children, childrenStyle }) => (
  <Header style={headerContainerStyle}>
    <Title style={titleStyle}>{title}</Title>
    <div style={childrenStyle || { paddingRight: 24 }}>{children}</div>
  </Header>
)

PanelHeader.propTypes = {
  headerContainerStyle: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  childrenStyle: PropTypes.object,
}

PanelHeader.defaultProps = {
  headerContainerStyle: {},
  title: 'This is PanelHeader title',
  titleStyle: {},
  childrenStyle: null,
}

export default PanelHeader
