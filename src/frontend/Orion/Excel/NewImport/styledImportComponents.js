import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../../utils/color'
import FontSpace from '../../../utils/fontspace'
import Spacing from '../../../utils/spacing'

export const PageContainer = styled.div({
  padding: Spacing.EXTRA_LARGE,
  flex: '1 1 auto',
  overflowY: 'scroll',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
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
  background: transparentize(0.85, Color.BLUE),
  borderRadius: 4,
  padding: 8,
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.90, Color.BLUE),
  }
})

export const ErrorContainer = styled.div({
  ...FontSpace.FS2,
  background: transparentize(0.9, Color.RED),
  borderRadius: 4,
  color: Color.RED,
  fontWeight: 500,
  marginTop: Spacing.S7,
  overflow: 'auto',
  padding: Spacing.S7,
  whiteSpace: 'pre-wrap',
})

export const CardHeader = styled.div({
  fontSize: 16,
  fontWeight: 700,
  padding: `${Spacing.S6} ${Spacing.S7}`,
})
