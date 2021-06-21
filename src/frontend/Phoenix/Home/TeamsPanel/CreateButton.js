import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import CreateTeamButton from './TeamForm/Button'

import { CREATE_TEAM } from '../../../api/mutations'

import { GET_TEAMS } from 'frontend/api/queries'

import { Colors } from '../../../utils/pulseStyles'

const CreateButton = ({ handleClick }) => {
  const location = useLocation()

  const { clientId: selectedClientId } =
    (location.search && queryString.parse(location.search)) || {}

  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery(GET_TEAMS, {
    variables: { clientId: selectedClientId },
  })

  const [createTeam, { loading, error }] = useMutation(CREATE_TEAM, {
    update: (cache, { data: { createTeam } }) => {
      const newTeamsData = teamsData.teams
      let i = 0

      while (
        i < newTeamsData.length &&
        newTeamsData[i].description.toLowerCase() <
          createTeam.description.toLowerCase()
      ) {
        i++
      }
      newTeamsData.splice(i, 0, createTeam)

      cache.writeQuery({
        query: GET_TEAMS,
        data: { teams: newTeamsData },
        variables: { clientId: selectedClientId },
      })
    },
    onCompleted: ({ createTeam }) => {
      handleClick(createTeam._id)
    },
    onError: alert,
  })

  if (teamsLoading) return null
  if (teamsError) return <div>{teamsError}</div>

  const mutationObj = {
    mutationFunc: createTeam,
    loading,
    error,
  }

  return (
    <CreateTeamButton
      modalTitle="Create Team"
      buttonLabel="Create Team"
      buttonColor={Colors.PRIMARY}
      clientId={selectedClientId}
      mutationObj={mutationObj}
    />
  )
}

CreateButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default CreateButton
