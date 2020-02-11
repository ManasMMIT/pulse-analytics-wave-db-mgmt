import styled from '@emotion/styled'
import { lighten, darken, transparentize } from 'polished'
import { Colors, Spacing } from '../../../../utils/pulseStyles'

const statusContainerBackgroundColor = darken(0.03, Colors.TOOL_SIDEBAR)

export const OpLogTitle = styled.div({
  alignSelf: 'baseline',
  borderBottom: `1px solid ${transparentize(0.9, Colors.WHITE)}`,
  color: transparentize(0.5, Colors.WHITE),
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  marginBottom: Spacing.NORMAL,
  paddingBottom: Spacing.NORMAL,
  textTransform: 'uppercase',
})

export const OpLogRefreshLabel = styled.div({
  color: transparentize(0.5, Colors.WHITE),
  fontSize: 10,
  fontWeight: 400,
})

export const OpLogLastUpdatedContainer = styled.div({
  alignSelf: 'stretch',
  background: statusContainerBackgroundColor,
  borderRadius: 4,
  color: Colors.WHITE,
  fontSize: 12,
  lineHeight: '18px',
  margin: `${Spacing.LARGE} 0 0`,
  padding: Spacing.NORMAL,
})

export const OpLogLastUpdatedTitle = styled.div({
  color: transparentize(0.5, Colors.WHITE),
  fontSize: 10,
  marginBottom: Spacing.TINY,
})

export const OpLogContainer = styled.div({
  alignSelf: 'stretch',
  background: statusContainerBackgroundColor,
  borderRadius: 4,
  flex: '1 0 0',
  marginTop: Spacing.LARGE,
  overflowY: 'auto',
  padding: Spacing.SMALL,
})

export const OpLogList = styled.ul({
  color: Colors.WHITE,
  marginBlockEnd: 0,
  marginBlockStart: 0,
  paddingInlineStart: 0,
})

export const OpLogListItem = styled.li({
  borderBottom: `1px solid ${transparentize(0.9, Colors.WHITE)}`,
  fontSize: 10,
  listStyle: 'none',
  marginBottom: Spacing.NORMAL,
  paddingBottom: Spacing.SMALL,
})

export const TimeUserContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: Spacing.TINY,
})

export const TimeStamp = styled.span({
  marginRight: Spacing.SMALL,
  opacity: 0.5,
})

export const User = styled.span({
  background: transparentize(0.9, Colors.WHITE),
  borderRadius: 2,
  color: transparentize(0.5, Colors.WHITE),
  fontWeight: 500,
  padding: '2px 4px',
})

export const ActionContainer = styled.div({
  display: 'flex',
  lineHeight: '18px',
})

export const Client = styled.span({
  color: lighten(0, Colors.PHOENIX),
  marginRight: Spacing.TINY,
})

export const Action = styled.span({
  cursor: 'context-menu',
  fontSize: 12,
})

export const OpLogLoadingContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: Spacing.MAX,
})

export const OpLogLoadingMessage = styled.div({
  color: Colors.WHITE,
  fontSize: 10,
  fontWeight: 700,
  marginTop: Spacing.NORMAL,
  textTransform: 'uppercase',
})
