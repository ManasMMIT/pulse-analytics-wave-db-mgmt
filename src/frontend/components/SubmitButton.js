import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import {
  Spacing,
  Transitions,
  FontFamily,
} from 'frontend/utils/pulseStyles'

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

export default SubmitButton
