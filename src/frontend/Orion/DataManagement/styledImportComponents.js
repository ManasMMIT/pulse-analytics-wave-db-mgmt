import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../utils/color'
import FontSpace from '../../utils/fontspace'
import Spacing from '../../utils/spacing'

export const PageContainer = styled.div({
  width: '100%'
})

export const PageHeaderContainer = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: Spacing.S7,
})

export const PageHeader = styled.h1({
  ...FontSpace.FS4,
  color: Color.BLACK,
  fontWeight: 700,
  textTransform: 'uppercase',
})

export const ImportFormContainer = styled.div({
  padding: Spacing.S7,
})

export const FieldLabel = styled.div({
  ...FontSpace.FS2,
  fontWeight: 700,
  marginBottom: Spacing.S3,
})

export const FieldContainer = styled.div({
  marginBottom: Spacing.S7,
})

export const FileInput = styled.input({
  color: Color.PRIMARY,
  fontWeight: 700,
  width: '100%',
})

export const ErrorContainer = styled.div({
  ...FontSpace.FS2,
  background: transparentize(0.9, Color.RED),
  borderRadius: 4,
  color: Color.RED,
  fontWeight: 500,
  height: 600,
  marginTop: Spacing.S7,
  overflow: 'auto',
  padding: Spacing.S7,
  whiteSpace: 'pre-wrap',
})
