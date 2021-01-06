import React from 'react'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import Button from '../../../Button'

const DeleteButton = ({
  toggleDeleteConfirmation,
  showDeleteConfirmation,
  isDisplayed,
}) => {
  if (!isDisplayed) return null

  return (
    <Button
      buttonStyle={{ margin: Spacing.S3 }}
      color={Color.RED}
      type="secondary"
      iconName="delete"
      iconColor1={Color.RED}
      onClick={() => toggleDeleteConfirmation(!showDeleteConfirmation)}
    >
      {showDeleteConfirmation ? 'Cancel Delete' : 'Delete'}
    </Button>
  )
}

export default DeleteButton
