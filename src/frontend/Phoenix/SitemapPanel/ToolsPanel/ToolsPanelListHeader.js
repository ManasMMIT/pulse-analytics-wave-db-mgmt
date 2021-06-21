import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'

import { panelHeaderStyle, panelTitleStyle } from '../shared/panelStyles'

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

const TOOLS_TITLE = 'TOOLS'

const ToolsPanelListHeader = () => (
  <Header style={panelHeaderStyle}>
    <Title style={panelTitleStyle}>{TOOLS_TITLE}</Title>
  </Header>
)

export default ToolsPanelListHeader
