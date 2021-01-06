import React from 'react'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import Spinner from '../../../Spinner'
import Button from '../../../Button'

const SaveButton = ({ save, inFlight }) => (
  <Button
    buttonStyle={{ margin: Spacing.S3 }}
    color={Color.GREEN}
    onClick={save}
  >
    {inFlight ? <Spinner /> : 'Save'}
  </Button>
)

export default SaveButton
