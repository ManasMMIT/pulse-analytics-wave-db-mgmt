import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import {
  GET_CLIENT_TEAMS,
} from '../../../api/queries'

import {
  UPDATE_ROLE_SITEMAP,
} from '../../../api/mutations'

import Spinner from '../../shared/Spinner'

const submitButtonStyle = {
  backgroundColor: '#0668D9',
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
  padding: 6,
  cursor: 'pointer',
}

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
    <button
      onClick={updateRoleSitemap}
      style={submitButtonStyle}
    >
      Submit Changes
    </button>
  )
}

SubmitButton.propTypes = {
  teamId: PropTypes.string,
  updatedSitemap: PropTypes.object,
}

export default SubmitButton
