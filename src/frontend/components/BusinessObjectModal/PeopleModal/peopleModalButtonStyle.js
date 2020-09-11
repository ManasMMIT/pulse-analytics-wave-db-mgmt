import { lighten, mix } from 'polished'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Transitions from 'frontend/utils/transitions'

const createButtonStyle = {
  display: 'inline-flex',
  background: Color.PRIMARY,
  color: Color.WHITE,
  alignItems: 'center',
  padding: `${Spacing.S2} ${Spacing.S3}`,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  ...FontSpace.FS2,
  transition: `background ${Transitions.NORMAL}`,
  ':hover': {
    background: lighten(0.1, Color.PRIMARY),
  },
  ':active': {
    background: mix(0.1, Color.BLACK, Color.PRIMARY),
  },
}

export default createButtonStyle
