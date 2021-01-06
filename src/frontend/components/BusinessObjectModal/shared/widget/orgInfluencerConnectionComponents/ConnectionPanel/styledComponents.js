import styled from '@emotion/styled'
import { transparentize } from 'polished'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

export const ConnectionPanelWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  borderLeft: `2px solid ${transparentize(0.9, Color.BLACK)}`,
})

export const FieldContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  background: Color.GRAY_LIGHT,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

export const FormLabel = styled.label({
  color: Color.BLACK,
  fontWeight: 700,
  ...FontSpace.FS2,
})

export const FieldWrapper = styled.div({
  margin: Spacing.S4,
})

export const FormWrapper = styled.div({
  overflowY: 'scroll',
})

export const FlexWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const RequiredLabel = styled.span({
  color: Color.RED,
})
