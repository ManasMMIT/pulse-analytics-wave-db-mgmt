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
  height: '100%',
  background: Color.GRAY_LIGHT,
  borderRadius: '0 0 8px 0',
})

export const BookHeader = styled.h2({
  color: Color.BLACK,
  fontSize: 14,
  fontWeight: 700,
})

export const BookLabel = styled.h3({
  fontSize: 12,
  fontWeight: 700,
  color: Color.BLACK,
})

export const BookContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: `${Spacing.S2} ${Spacing.S4}`,
  background: Color.GRAY_LIGHT,
  // borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

export const BookWrapper = styled.div({
  margin: Spacing.S2,
  borderRadius: 4,
  padding: `${Spacing.S1} ${Spacing.S4} ${Spacing.S4}`,
  background: transparentize(0.2, Color.WHITE),
})
