import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../../../../utils/pulseStyles'

export const SectionHeader = styled.div({
  borderTop: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

export const CreateConnectionButton = styled.button({
  background: transparentize(0.85, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  color: Colors.PRIMARY,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.75, Colors.PRIMARY)
  },
  ':focus': {
    outline: 'none',
  },
  ':active': {
    background: transparentize(0.65, Colors.PRIMARY)
  }
})

export const ConnectionsWrapper = styled.div({
  maxHeight: 400,
  overflowY: 'scroll',
})


export const ConnectionCard = styled.div({
  alignItems: 'flex-end',
  background: Colors.WHITE,
  borderRadius: 4,
  border: `1px solid ${Colors.WHITE}`,
  color: Colors.BLACK,
  display: 'flex',
  fontWeight: 500,
  justifyContent: 'space-between',
  margin: '12px 0px',
  padding: `${Spacing.NORMAL} ${Spacing.NORMAL} ${Spacing.SMALL}`,
  ':hover': {
    borderColor: transparentize(0.8, Colors.BLACK),
  }
})

export const ConnectionCategory = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginRight: Spacing.NORMAL,
})

const connectionLabelColor = Colors.BLACK

export const ConnectionCategoryLabel = styled.h4({
  fontSize: 9,
  color: transparentize(0.7, connectionLabelColor),
  fontWeight: 700,
  // Uncomment for tag style
  // background: transparentize(0.92, connectionLabelColor),
  // padding: `${Spacing.TINY} ${Spacing.TINY}`,
  margin: `0 0 ${Spacing.SMALL}`,
  borderRadius: 4,
  lineHeight: 1,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
})

export const RemoveConnectionButton = styled.button({
  fontWeight: 700,
  fontSize: 18,
  color: Colors.RED,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  background: transparentize(0.9, Colors.RED),
  ':hover': {
    background: transparentize(0.75, Colors.RED),
  }
})

export const ConnectionLanguage = styled.span({
  fontSize: 12,
  fontWeight: 500,
})

export const ConnectionFormLabel = styled.div({
  marginRight: Spacing.NORMAL,
  fontWeight: 500,
  fontSize: 12,
})

export const SubmitNewConnectionButton = styled.button({
  background: transparentize(0.85, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  color: Colors.PRIMARY,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.75, Colors.PRIMARY)
  },
  ':focus': {
    outline: 'none',
  },
  ':active': {
    background: transparentize(0.65, Colors.PRIMARY)
  },
  ':disabled': {
    opacity: 0.3,
    cursor: 'not-allowed',
  }
})

export const ConnectionAccount = styled.span({
  fontWeight: 500,
  color: Colors.PRIMARY,
})

export const ConnectionText = styled.span({
  fontWeight: 400,
  color: Colors.BLACK,
})

export const ConnectionTypeTag = styled.span({
  fontSize: 9,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  background: transparentize(0.92, Colors.BLACK),
  color: transparentize(0.7, Colors.BLACK),
  padding: `${Spacing.MICRO} ${Spacing.TINY}`,
  borderRadius: 4,
})
