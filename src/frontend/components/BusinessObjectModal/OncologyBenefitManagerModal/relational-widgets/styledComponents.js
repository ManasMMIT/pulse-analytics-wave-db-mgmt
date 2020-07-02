import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../../../utils/color'

const borderStyle = `1px solid ${transparentize(0.9, Color.BLACK)}`

export const WidgetPanelHeader = styled.div({
  background: Color.WHITE,
  borderBottom: `2px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: '12px 24px',
  position: 'sticky',
  top: 0,
  zIndex: 10,
})

export const WidgetPanelTitle = styled.h2({
  color: Color.PRIMARY,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
})

export const RelationalRow = styled.div({
  background: Color.WHITE,
  display: 'flex',
  borderBottom: borderStyle,
  padding: '8px 12px',
  alignItems: 'center',
  ':hover': {
    background: transparentize(0.85, Color.MEDIUM_GRAY_2),
  },
})

export const InputContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  margin: '0 12px',
})

export const InputLabel = styled.label({
  marginRight: 12,
  fontSize: 12,
  fontWeight: 700,
  color: Color.BLACK,
})

export const RowInput = styled.input({
  fontSize: 12,
  borderRadius: 4,
  background: Color.WHITE,
  border: `1px solid ${transparentize(0.6, Color.MEDIUM_GRAY_2)}`,
  padding: 12,
  width: 400,
  ':hover': {
    border: `1px solid ${transparentize(0.2, Color.MEDIUM_GRAY_2)}`,
  },
  ':focus': {
    border: `1px solid ${Color.PRIMARY}`,
    boxShadow: `0 0 0 1px ${Color.PRIMARY}`,
  },
})

export const DeleteButton = styled.button({
  background: transparentize(0.85, Color.MEDIUM_GRAY_2),
  borderRadius: 4,
  color: Color.MEDIUM_GRAY_2,
  marginRight: 12,
  padding: '8px 12px',
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.85, Color.RED),
    color: Color.RED,
  },
  ':active': {
    background: transparentize(0.65, Color.RED),
  },
})

export const FixedControlRow = styled.div({
  background: Color.WHITE,
  borderTop: `2px solid ${transparentize(0.9, Color.BLACK)}`,
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  left: 0,
  padding: '12px 24px',
  position: 'sticky',
  width: '100%',
  '@media (max-width: 1100px)': {
    flexDirection: 'column',
  },
})

export const SaveContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  '@media (max-width: 1100px)': {
    marginTop: 24,
  },
})

export const SaveWarningBox = styled.div({
  background: transparentize(0.9, Color.GREEN),
  color: Color.GREEN,
  borderRadius: 4,
  padding: '8px 12px',
  fontSize: 12,
  fontWeight: 700,
  marginRight: 12,
})
