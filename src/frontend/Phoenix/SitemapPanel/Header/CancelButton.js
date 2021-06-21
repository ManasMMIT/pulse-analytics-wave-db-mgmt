import React from 'react'
import styled from '@emotion/styled'
import { Link, useLocation, useParams } from 'react-router-dom'
import queryString from 'query-string'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../../utils/pulseStyles'

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
    background: transparentize(0.75, Colors.PRIMARY),
  },
})

const CancelButton = () => {
  const location = useLocation()

  const { clientId, teamId } = useParams()
  const { userId } =
    (location.search && queryString.parse(location.search)) || {}

  const getSearchString = () => {
    const newSearchParams = {
      clientId,
      teamId,
      userId,
    }

    const searchString = queryString.stringify(newSearchParams)

    return searchString
  }

  return <StyledLink to={`/phoenix?${getSearchString()}`}>Close</StyledLink>
}

export default CancelButton
