import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginRight: 24,
  fontWeight: 700,
})

const Title = styled.div({
  fontSize: 20,
  fontWeight: 700,
  padding: 24,
})

const PanelHeader = ({
  headerContainerStyle,
  title,
  titleStyle,
  children,
}) => (
  <Header style={headerContainerStyle}>
    <Title style={titleStyle}>{title}</Title>

    { children }
  </Header>
)

PanelHeader.propTypes = {
  headerContainerStyle: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
}

PanelHeader.defaultProps = {
  headerContainerStyle: {},
  title: 'This is PanelHeader title',
  titleStyle: {},
}

export default PanelHeader
