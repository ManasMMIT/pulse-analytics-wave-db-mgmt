import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'
import FontSpace from '../../utils/fontspace'

export const FormLabel = styled.div({
  textTransform: 'capitalize',
  marginBottom: Spacing.S3,
  fontWeight: 700,
  ...FontSpace.FS2,
})

export const StyledInput = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3}`,
  borderRadius: 4,
  outline: 'none',
  ...FontSpace.FS2,
  ':hover': {
    boxShadow: `0 0 0 1px ${transparentize(0.7, Color.BLACK)}`,
  },
  ':focus': {
    boxShadow: `0 0 0 2px ${Color.PRIMARY}`,
  }
})

export const createObjectModalStyle = {
  justifyContent: 'flex-start',
  minHeight: 600,
  minWidth: 400,
}

export const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  color: Color.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  ':hover': {
    background: transparentize(0.95, Color.BLACK),
  }
}

export const NewAccessCaptionButton = styled.button({
  background: transparentize(0.85, Color.MEDIUM_GRAY_2),
  borderRadius: 4,
  color: Color.MEDIUM_GRAY_2,
  cursor: 'pointer',
  fontWeight: 700,
  marginBottom: 24,
  padding: Spacing.S4,
  width: 'auto',
  ':hover': {
    background: transparentize(0.7, Color.MEDIUM_GRAY_2),
  }
})
