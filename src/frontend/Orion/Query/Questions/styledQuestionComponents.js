import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { mix, transparentize } from 'polished'

import { Colors, Spacing, Transitions } from '../../../utils/pulseStyles'

export const QuestionsPageContainer = styled.div({
  background: mix(0.3, Colors.LIGHT_GRAY_1, Colors.WHITE),
  width: '100%',
})

export const PageHeaderContainer = styled.div({
  padding: `${Spacing.LARGE} ${Spacing.HUGE}`,
})

export const PageHeader = styled.h1({
  fontSize: 16,
  letterSpacing: -0.2,
  lineHeight: '24px',
  color: Colors.BLACK,
  textTransform: 'uppercase',
  marginBottom: Spacing.EXTRA_LARGE,
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

const linkColor = Colors.BLACK

export const QuestionButtonLinkContainer = styled.div({
  padding: `${Spacing.NORMAL}`,
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
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '22px',
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
