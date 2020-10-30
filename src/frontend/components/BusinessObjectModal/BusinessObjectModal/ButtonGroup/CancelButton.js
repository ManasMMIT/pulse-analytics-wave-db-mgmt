import React from 'react'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import Button from '../../../Button'

const CancelButton = ({ resetInput }) => (
  <Button
    buttonStyle={{ margin: Spacing.S3 }}
    color={Color.GRAY_DARK}
    type="secondary"
    onClick={resetInput}
  >
    Cancel
  </Button>
)

export default CancelButton
