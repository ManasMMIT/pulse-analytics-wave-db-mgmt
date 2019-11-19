import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import { lighten } from 'polished'

import {
  GET_CLIENT_TEAMS,
} from '../../../api/queries'

import {
  UPDATE_ROLE_SITEMAP,
} from '../../../api/mutations'

import Spinner from '../../shared/Spinner'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const StyledButton = styled.button({
  backgroundColor: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  padding: `${Spacing.TINY} ${Spacing.SMALL}`,
  ':hover': {
    backgroundColor: lighten(0.1, Colors.PRIMARY),
  }
})

const SubmitButton = ({
  teamId,
  updatedSitemap,
}) => {
  const [updateRoleSitemap, { loading, error }] = useMutation(
    UPDATE_ROLE_SITEMAP, {
      variables: { input: { updatedSitemap, teamId } },
      refetchQueries: [{ query: GET_CLIENT_TEAMS }]
    }
  )

  if (loading) return <Spinner />
  if (error) return (
    <div style={{ color: 'red' }}>
      Error processing request
    </div>
  )

  return (
    <StyledButton
      onClick={updateRoleSitemap}
    >
      Submit Changes
    </StyledButton>
  )
}

SubmitButton.propTypes = {
  teamId: PropTypes.string,
  updatedSitemap: PropTypes.object,
}

export default SubmitButton
