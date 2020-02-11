import styled from "@emotion/styled"

import { transparentize, mix } from 'polished'
import { Colors, Spacing } from '../../../../../../../../utils/pulseStyles'

export const IndicationPanelContainer = styled.div({
  borderRight: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderTop: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  maxHeight: 700,
  overflow: 'auto',
  width: '50%',
  background: Colors.WHITE,
})

export const ListHeader = styled.div({
  fontSize: 14,
  fontWeight: 700,
  padding: `${Spacing.NORMAL} ${Spacing.LARGE}`,
  textTransform: 'uppercase',
})

export const ActiveRow = styled.div({
  background: mix(0.8, Colors.WHITE, Colors.GREEN),
  color: Colors.GREEN,
  fontSize: 10,
  fontWeight: 700,
  lineHeight: '18px',
  padding: '8px 24px',
  position: 'sticky',
  top: 0,
  zIndex: 5,
})

export const InactiveRow = styled.div({
  background: mix(0.8, Colors.WHITE, Colors.MEDIUM_GRAY_2),
  color: Colors.MEDIUM_GRAY_2,
  fontSize: 10,
  fontWeight: 700,
  lineHeight: '18px',
  padding: '8px 24px',
  position: 'sticky',
  top: 0,
  zIndex: 5,
})

export const UnorderedList = styled.ul({
  padding: `0 ${Spacing.NORMAL}`,
})
