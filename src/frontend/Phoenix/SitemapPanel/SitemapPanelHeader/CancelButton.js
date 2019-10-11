import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'

import {
  SELECT_TOOL,
} from '../../../api/mutations'

const cancelButtonStyle = {
  color: '#EE5340',
  fontWeight: 600,
  fontSize: 14,
  padding: '8px 16px'
}

const CancelButton = () => {
  const [resetToolSelection] = useMutation(SELECT_TOOL)

  return (
    <Link
      to="/phoenix"
      style={cancelButtonStyle}
      onClick={resetToolSelection}
    >
      Cancel
    </Link>
  )
}

export default CancelButton
