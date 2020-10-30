import React from 'react'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import Button from '../../../Button'

const CloseButton = ({ closeModal }) => (
  <Button
    buttonStyle={{ margin: Spacing.S3 }}
    color={Color.GRAY_DARK}
    type="secondary"
    onClick={closeModal}
  >
    Close
  </Button>
)

export default CloseButton
