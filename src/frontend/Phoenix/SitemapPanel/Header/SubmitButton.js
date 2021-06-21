import React from 'react'
import { useParams } from 'react-router'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import { lighten } from 'polished'

import { GET_TEAMS } from '../../../api/queries'

import { UPDATE_ROLE_SITEMAP } from '../../../api/mutations'

import Spinner from 'frontend/components/Spinner'

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
  },
})

const SubmitButton = ({ teamId, updatedSitemap }) => {
  const { clientId } = useParams()

  const [updateRoleSitemap, { loading, error }] = useMutation(
    UPDATE_ROLE_SITEMAP,
    {
      variables: { input: { updatedSitemap, teamId } },
      update: (cache) => {
        const { teams } = cache.readQuery({
          query: GET_TEAMS,
          variables: { clientId },
        })

        const teamIndex = teams.findIndex(({ _id }) => _id === teamId)
        const stagedTeam = teams[teamIndex]
        stagedTeam.sitemap = updatedSitemap
        teams[teamIndex] = stagedTeam

        cache.writeQuery({
          query: GET_TEAMS,
          data: { teams },
          variables: { clientId },
        })
      },
    }
  )

  if (loading)
    return (
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
  if (error)
    return <div style={{ color: Colors.RED }}>Error processing request</div>

  return <StyledButton onClick={updateRoleSitemap}>Submit Changes</StyledButton>
}

SubmitButton.propTypes = {
  teamId: PropTypes.string,
  updatedSitemap: PropTypes.object,
}

export default SubmitButton
