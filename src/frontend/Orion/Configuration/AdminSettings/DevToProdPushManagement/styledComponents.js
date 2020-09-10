import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { Colors, Spacing, Transitions } from 'frontend/utils/pulseStyles'
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
  background: Colors.PRIMARY,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    background: transparentize(0.9, Colors.PRIMARY),
    color: Colors.PRIMARY,
  },
  ':focus': {
    outline: 'none',
  },
})

export const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
})

export const TitleInput = styled.input({
  fontSize: 16,
  fontWeight: 600,
  padding: `${Spacing.SMALL}`,
  borderRadius: 4,
  border: '1px solid',
  borderColor: transparentize(0.9, Colors.BLACK),
  caretColor: Colors.PRIMARY,
  transition: Transitions.NORMAL,
  ':focus': {
    borderColor: Colors.PRIMARY,
    outline: 'none',
    boxShadow: `0 0 0 1px ${Colors.PRIMARY}`,
  },
  ':hover': {
    borderColor: Colors.PRIMARY,
  },
  '::placeholder': {
    color: transparentize(0.7, Colors.BLACK),
  },
})

export const StyledLabel = styled.label({
  fontSize: 12,
  lineHeight: '22px',
  fontWeight: 600,
  color: Colors.BLACK,
  marginBottom: Spacing.TINY,
})
