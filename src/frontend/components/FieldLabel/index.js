import React from 'react'
import styled from '@emotion/styled'

import FontSpace from '../../utils/fontspace'
import Color from '../../utils/color'

const CARD_LABEL_STYLE = {
  textTransform: 'uppercase',
  color: Color.MEDIUM_GRAY_2,
}

const Label = styled.div({
  fontWeight: 700,
  ...FontSpace.FS2,
}, ({ isCardLabel }) => ({
  ...(isCardLabel ? CARD_LABEL_STYLE : {})
}))

const FieldLabel = ({
  label,
  isCardLabel,
}) => (
  <Label isCardLabel={isCardLabel}>
    { label }
  </Label>
)

export default FieldLabel