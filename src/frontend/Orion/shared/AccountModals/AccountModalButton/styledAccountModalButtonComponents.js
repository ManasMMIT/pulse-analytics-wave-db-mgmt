import styled from '@emotion/styled'
import { transparentize } from 'polished'

import {
  Spacing,
  Transitions,
  FontFamily,
} from '../../../../utils/pulseStyles'

import Color from '../../../../utils/color'

export const ButtonLabel = styled.button({
  background: 'none',
  border: 'none',
  borderRadius: 4,
  padding: '8px 12px',
  color: transparentize(0.7, Color.BLACK),
  cursor: 'pointer',
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    background: transparentize(0.9, Color.PRIMARY),
    color: Color.PRIMARY,
  },
  ':focus': {
    outline: 'none',
  }
}, ({ children, ...props }) => ({ ...props })) // not sure why children is here // ? also doesn't this allow onClick through even though it's not styling related?

export const SectionTitle = styled.h3({
  fontSize: 14,
  lineHeight: '24px',
  letterSpacing: -0.2,
  color: Color.BLACK,
})

export const Label = styled.label({
  fontSize: 12,
  color: Color.BLACK,
  lineHeight: '24px',
  letterSpacing: -0.2,
  display: 'flex',
  flexDirection: 'column',
  width: 400,
  textTransform: 'capitalize',
})

export const LabelText = styled.div({
  fontWeight: 500,
})

export const Input = styled.input({
  background: Color.WHITE,
  border: `1px solid ${transparentize(0.96, Color.BLACK)}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  marginBottom: Spacing.NORMAL,
  ':hover': {
    border: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  },
  ':focus': {
    border: `1px solid ${transparentize(0.1, Color.PRIMARY)}`,
    outline: 'none',
  }
}, props => ({ ...props }))

export const SubmitButton = styled.button({
  fontFamily: FontFamily.NORMAL,
  placeSelf: 'flex-end',
  cursor: 'pointer',
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  transition: Transitions.NORMAL,
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: 4,
  background: Color.GREEN,
  color: Color.WHITE,
  fontWeight: 600,
  fontSize: 12,
  marginLeft: 12,
  ':hover': {
    background: transparentize(0.2, Color.GREEN),
  }
})
