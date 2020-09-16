import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { Spacing, Transitions } from 'frontend/utils/pulseStyles'
import Color from 'frontend/utils/color'

export const StyledTopButton = styled.button({
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: transparentize(0.85, Color.PRIMARY),
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  color: Color.PRIMARY,
  marginBottom: 24,
  ':hover': {
    background: transparentize(0.75, Color.PRIMARY),
  },
})

export const StyledCardButton = styled.button({
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    background: transparentize(0.9, Color.PRIMARY),
    color: Color.PRIMARY,
  },
  ':focus': {
    outline: 'none',
  },
})

export const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
})

export const TitleInput = styled.input({
  fontSize: 16,
  fontWeight: 600,
  padding: `${Spacing.SMALL}`,
  borderRadius: 4,
  border: '1px solid',
  borderColor: transparentize(0.9, Color.BLACK),
  caretColor: Color.PRIMARY,
  transition: Transitions.NORMAL,
  ':focus': {
    borderColor: Color.PRIMARY,
    outline: 'none',
    boxShadow: `0 0 0 1px ${Color.PRIMARY}`,
  },
  ':hover': {
    borderColor: Color.PRIMARY,
  },
  '::placeholder': {
    color: transparentize(0.7, Color.BLACK),
  },
})

export const StyledLabel = styled.label({
  fontSize: 12,
  lineHeight: '22px',
  fontWeight: 600,
  color: Color.BLACK,
  marginBottom: Spacing.TINY,
})
