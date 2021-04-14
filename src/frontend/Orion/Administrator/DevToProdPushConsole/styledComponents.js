import styled from '@emotion/styled'
import { transparentize } from 'polished'
// import Color from 'frontend/utils/color'
import {
  Colors,
  Spacing,
  // Transitions
} from 'frontend/utils/pulseStyles'

export const CardContainer = styled.div({
  background: Colors.WHITE,
  borderRadius: 4,
  padding: Spacing.EXTRA_LARGE,
})

export const CardTitle = styled.div({
  fontSize: 16,
  fontWeight: 600,
  padding: `${Spacing.SMALL}`,
  borderRadius: 4,
  marginBottom: 16,
})

export const PushButton = styled.button({
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
