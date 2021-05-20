import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { GET_TEAMS } from 'frontend/api/queries'
import { CREATE_USER } from 'frontend/api/mutations'

import { Colors } from '../../../utils/pulseStyles'

import UserFormButton from './UserForm/Button'

const CreateButton = ({ handleClick }) => {
  const location = useLocation()

  const { clientId: selectedClientId, teamId: selectedTeamId } =
    (location.search && queryString.parse(location.search)) || {}

  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery(GET_TEAMS, {
    variables: { clientId: selectedClientId },
  })

  if (teamsLoading) return null
  if (teamsError) return <div>{teamsError}</div>

  const selectedTeam =
    teamsData.teams.find(({ _id }) => _id === selectedTeamId) || {}

  const defaultLanding = selectedTeam.defaultLandingPath
    ? { path: selectedTeam.defaultLandingPath, locked: false }
    : {}

  return (
    <UserFormButton
      modalTitle="Create User"
      buttonLabel="Create User"
      buttonColor={Colors.PRIMARY}
      selectedTeamId={selectedTeamId}
      userData={{
        _id: null, // for create user, _id has to be null bc undefined fetches all teams
        defaultLanding,
      }}
      mutationDoc={CREATE_USER}
      additionalFormData={{ clientId: selectedClientId }}
      handleClick={handleClick}
    />
  )
}

CreateButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default CreateButton
