import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { ZIndexes } from '../../../utils/pulseStyles'

const Header = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 700,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: ZIndexes.PANEL_HEADER,
})

const Title = styled.div({
  fontSize: 12,
  fontWeight: 700,
  padding: 24,
  textTransform: 'uppercase',
})

const PanelHeader = ({
  headerContainerStyle,
  title,
  titleStyle,
  children,
}) => (
  <Header style={headerContainerStyle}>
    <Title style={titleStyle}>{title}</Title>
    <div style={{paddingRight: 24}}>
      { children }
    </div>
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
