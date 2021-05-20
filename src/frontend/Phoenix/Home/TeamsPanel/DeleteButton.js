import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { GET_TEAMS } from 'frontend/api/queries'
import { DELETE_TEAM } from '../../../api/mutations'

import DeleteButton from '../../shared/DeleteButton'

export default ({ teamId, handleClick, searchParamKey }) => {
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

  const [deleteTeam, { loading, error }] = useMutation(DELETE_TEAM, {
    update: (cache) => {
      const newTeamsData = teamsData.teams.filter(({ _id }) => _id !== teamId)

      cache.writeQuery({
        query: GET_TEAMS,
        data: { teams: newTeamsData },
        variables: { clientId: selectedClientId },
      })
    },
    onCompleted: () => {
      const newSelectedTeam =
        teamsData.teams.find(({ _id }) => _id !== teamId) || {}

      handleClick(newSelectedTeam[searchParamKey])
    },
    onError: alert,
  })

  if (teamsLoading) return null
  if (teamsError) return <div>{teamsError}</div>

  const mutationObj = {
    mutationFunc: deleteTeam,
    loading,
    error,
  }

  return (
    <DeleteButton
      itemId={teamId}
      mutationObj={mutationObj}
      additionalFormData={{ clientId: selectedClientId }}
      modalTitle="Delete Team"
    />
  )
}
