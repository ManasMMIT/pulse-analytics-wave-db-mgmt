import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import { transparentize } from 'polished'
import { withStyles } from '@material-ui/core/styles'

import FontSpace from '../../utils/fontspace'
import Spacing from '../../utils/spacing'
import Color from '../../utils/color'

export const PageHeaderContainer = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: Spacing.S7,
  width: '100%',
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

export const StyledButton = withStyles({
  root: {
    ...FontSpace.FS2,
    background: transparentize(0.85, Color.PRIMARY),
    color: Color.PRIMARY,
    fontWeight: 700,
    padding: Spacing.S3,
    textTransform: 'capitalize',
    '&:hover': {
      background: transparentize(0.7, Color.PRIMARY),
    },
  },
})(Button)
