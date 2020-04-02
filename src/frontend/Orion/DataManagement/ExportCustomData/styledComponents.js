import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../../utils/color'
import FontSpace from '../../../utils/fontspace'
import Spacing from '../../../utils/spacing'

export const PageHeaderContainer = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: Spacing.S7,
  width: '100%'
})

export const PageHeader = styled.h1({
  ...FontSpace.FS4,
  colors: Color.BLACK,
  fontWeight: 700,
  textTransform: 'uppercase',
})

export const ContentContainer = styled.div({
  padding: Spacing.S7,
})

export const SectionHeader = styled.h2({
  ...FontSpace.FS3,
  colors: Color.BLACK,
  fontWeight: 700,
  marginBottom: Spacing.S5,
})

export const SectionContainer = styled.div({
  background: Color.LIGHT_BLUE_GRAY_2,
  borderRadius: 4,
  padding: Spacing.S7,
  marginBottom: Spacing.S7,
})

export const SelectLabel = styled.div({
  ...FontSpace.FS2,
  fontWeight: 700,
  marginBottom: Spacing.S3,
})

export const ErrorMessage = styled.div({
  ...FontSpace.FS2,
  background: transparentize(0.9, Color.RED),
  borderRadius: 4,
  color: Color.RED,
  fontWeight: 700,
  padding: Spacing.S5,
})
