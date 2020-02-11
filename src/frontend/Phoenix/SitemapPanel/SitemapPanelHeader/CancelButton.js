import React from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../../utils/pulseStyles'

import {
  SELECT_TOOL,
} from '../../../api/mutations'

const StyledLink = styled(Link)({
  background: transparentize(0.9, Colors.PRIMARY),
  borderRadius: 4,
  color: Colors.PRIMARY,
  fontWeight: 700,
  fontSize: 12,
  marginRight: Spacing.NORMAL,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  textDecoration: 'none',
  ':hover': {
    background: transparentize(0.75, Colors.PRIMARY)
  }
})

const CancelButton = () => {
  const [resetToolSelection] = useMutation(SELECT_TOOL)

  return (
    <StyledLink
      to="/phoenix"
      onClick={resetToolSelection}
    >
      Close
    </StyledLink>
  )
}

export default CancelButton
