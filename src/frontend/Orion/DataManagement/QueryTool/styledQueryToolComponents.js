import styled from '@emotion/styled'
import { mix, transparentize } from 'polished'

import { Colors, Spacing, ZIndexes } from './../../../utils/pulseStyles'

export const PageWrapper = styled.div({
  flex: 1,
  backgroundColor: Colors.WHITE,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'auto',
})
export const QueryControlsContainer = styled.div({
  background: mix(0.3, Colors.LIGHT_GRAY_1, Colors.WHITE),
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  padding: `${Spacing.LARGE} ${Spacing.HUGE}`,
  position: 'sticky',
  top: 0,
  width: '100%',
  boxSizing: 'border-box',
  zIndex: ZIndexes.QUERY_CONTROLS,
})

export const PageTitle = styled.h1({
  fontSize: 16,
  letterSpacing: -0.2,
  lineHeight: '24px',
  color: Colors.BLACK,
  textTransform: 'uppercase',
  marginBottom: Spacing.EXTRA_LARGE,
})

export const QueryControls = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: Spacing.NORMAL,
})

export const Question = styled.div({
  color: Colors.BLACK,
  fontSize: 12,
  letterSpacing: -0.2,
  lineHeight: '22px',
  fontWeight: 500,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
})

export const Label = styled.div({
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '24px',
})

export const SubmitButton = styled.button({
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  margin: `0 ${Spacing.EXTRA_LARGE}`,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.15, Colors.PRIMARY),
  },
  ':active': {
    background: mix(0.9, Colors.PRIMARY, Colors.BLACK),
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  }
})

export const ResultsContainer = styled.div({
  flex: '1 1 0%',
  overflowY: 'auto',
})

export const TableWrapper = styled.div({
  background: Colors.WHITE,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  padding: `0 ${Spacing.HUGE}`,
  overflowY: 'scroll',
})

export const TableHeaderWrapper = styled.div({
  backgroundColor: Colors.WHITE,
  display: 'flex',
  position: 'sticky',
  margin: '0px 32px',
})

export const TableBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
})

const tableCellStyle = {
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 400,
  lineHeight: '24px',
  letterSpacing: -0.2,
}

export const TableRow = styled.div({
  display: 'flex',
  flex: 1,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  ':hover': {
    background: transparentize(0.95, Colors.BLACK),
  },
  ':last-child': {
    borderBottom: `2px solid ${transparentize(0.7, Colors.BLACK)}`,
    marginBottom: Spacing.NORMAL,
  }
})

export const TableColumn = styled.div({
  ...tableCellStyle,
  flex: 1,
  padding: `${Spacing.TINY} ${Spacing.NORMAL}`,
})
