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
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
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

  if (loading) return (
    <div
      style={{
        diplay: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
      <span
        style={{
          color: Colors.PRIMARY,
          fontSize: 9,
          fontWeight: 700,
          paddingLeft: 12,
        }}
      >
        LOADING
      </span>
    </div>
  )
  if (error) return (
    <div style={{ color: Colors.RED }}>
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
