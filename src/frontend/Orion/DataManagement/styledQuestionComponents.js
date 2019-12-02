import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { mix, transparentize } from 'polished'

import { Colors, Spacing, Transitions } from '../../utils/pulseStyles'

export const QuestionsPageContainer = styled.div({
  background: transparentize(0.5, Colors.LIGHT_GRAY_1),
  padding: Spacing.NORMAL,
  width: '100%',
})

export const PageHeaderContainer = styled.div({
  padding: `${Spacing.EXTRA_LARGE} ${Spacing.EXTRA_LARGE} 0`,
})

export const PageHeader = styled.div({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  textTransform: 'uppercase',
})

export const PageDescription = styled.p({
  color: Colors.BLACK,
  fontSize: 12,
  fontWeight: 400,
})

export const QuestionsListContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.NORMAL,
})

const linkColor = Colors.PRIMARY

export const QuestionButtonLinkContainer = styled.div({
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
})

export const QuestionArrow = styled.span({
  color: Colors.PRIMARY,
})

const shadowColor = mix(0.3, Colors.BLACK, Colors.PRIMARY)

export const QuestionButtonLink = styled(Link)({
  background: Colors.WHITE,
  borderRadius: 4,
  color: linkColor,
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 600,
  padding: Spacing.LARGE,
  textDecoration: 'none',
  transition: Transitions.NORMAL,
  ':visited': {
    color: linkColor,
  },
  ':hover': {
    boxShadow: `0 2px 13px 0 ${transparentize(0.8, shadowColor)}`,
  }
})
