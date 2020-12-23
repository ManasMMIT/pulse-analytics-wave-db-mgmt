import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'

export const ContentWrapper = styled.div(
  {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${Spacing.S2} ${Spacing.S4}`,
    borderRadius: 4,
    cursor: 'pointer',
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? transparentize(0.85, Color.BLUE) : Color.WHITE,
    ':hover': {
      backgroundColor: isActive
        ? transparentize(0.85, Color.BLUE)
        : transparentize(0.85, Color.BLACK),
    },
  })
)

export const TextWrapper = styled.div({}, ({ isActive, isDisabled }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  color: isActive ? Color.PRIMARY : Color.BLACK,
  opacity: isDisabled ? 0.5 : 1,
  fontStyle: isDisabled ? 'italic' : 'normal',
}))

export const OrganizationType = styled.div({
  ...FontSpace.FS2,
  lineHeight: '18px',
  fontWeight: 500,
  fontStyle: 'inherit',
})

export const Title = styled.div({
  ...FontSpace.FS2,
  lineHeight: '18px',
  fontWeight: 700,
  fontStyle: 'inherit',
})

export const Subtitle = styled.div({
  ...FontSpace.FS2,
  fontWeight: 400,
  lineHeight: '18px',
  fontStyle: 'inherit',
})

export const Description = styled.div({
  ...FontSpace.FS2,
  lineHeight: '15px',
  fontStyle: 'inherit',
})

export const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const listItemStyle = {
  padding: `6px ${Spacing.S4}`,
}
