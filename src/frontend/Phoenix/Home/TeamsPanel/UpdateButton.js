import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { GET_TEAMS } from 'frontend/api/queries'
import { UPDATE_TEAM } from '../../../api/mutations'

import Color from 'frontend/utils/color'

import UpdateTeamButton from './TeamForm/Button'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  color: transparentize(0.7, Color.BLACK),
  ':hover': {
    color: Color.PRIMARY,
    background: transparentize(0.85, Color.PRIMARY),
  },
  ':active': {
    background: transparentize(0.85, Color.PRIMARY),
  },
})

const editIcon = <EditIcon size="lg" icon={faEdit} />

const UpdateButton = ({ team }) => {
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

  const [updateTeam, { loading, error }] = useMutation(UPDATE_TEAM, {
    update: (cache, { data: { updateTeam } }) => {
      const newTeamsData = teamsData.teams.filter(
        ({ _id }) => _id !== updateTeam._id
      )
      let i = 0

      while (
        i < newTeamsData.length &&
        newTeamsData[i].description.toLowerCase() <
          updateTeam.description.toLowerCase()
      ) {
        i++
      }
      newTeamsData.splice(i, 0, updateTeam)

      cache.writeQuery({
        query: GET_TEAMS,
        data: { teams: newTeamsData },
        variables: { clientId: selectedClientId },
      })
    },
    onError: alert,
  })

  if (teamsLoading) return null
  if (teamsError) return <div>{teamsError}</div>

  const mutationObj = {
    mutationFunc: updateTeam,
    loading,
    error,
  }

  return (
    <UpdateTeamButton
      modalTitle="Edit Team"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none' }}
      team={team}
      mutationObj={mutationObj}
    />
  )
}

UpdateButton.propTypes = {
  team: PropTypes.object.isRequired,
}

export default UpdateButton
