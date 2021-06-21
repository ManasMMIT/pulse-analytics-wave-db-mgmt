import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery, useMutation } from '@apollo/react-hooks'

import DeleteButton from '../../shared/DeleteButton'

import { GET_USERS, GET_USER_TEAMS } from 'frontend/api/queries'
import { DELETE_USER } from '../../../api/mutations'

export default ({ userId, handleClick, searchParamKey }) => {
  const location = useLocation()

  const { clientId: selectedClientId, teamId: selectedTeamId } =
    (location.search && queryString.parse(location.search)) || {}

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_USERS, {
    variables: { teamId: selectedTeamId },
  })

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(GET_USERS, {
    variables: { clientId: selectedClientId },
  })

  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    update: (cache) => {
      const { teams } = cache.readQuery({
        query: GET_USER_TEAMS,
        variables: { userId },
      })

      teams.forEach(({ _id }) => {
        const { users: tempUsers } = cache.readQuery({
          query: GET_USERS,
          variables: { teamId: _id },
        })

        const newUsers = tempUsers.filter(({ _id }) => _id !== userId)

        cache.writeQuery({
          query: GET_USERS,
          data: { users: newUsers },
          variables: { teamId: _id },
        })
      })

      const { users: tempAllUsers } = cache.readQuery({
        query: GET_USERS,
        variables: { clientId: selectedClientId },
      })

      const newAllUsers = tempAllUsers.filter(({ _id }) => _id !== userId)

      cache.writeQuery({
        query: GET_USERS,
        data: { users: newAllUsers },
        variables: { clientId: selectedClientId },
      })
    },
    onCompleted: () => {
      const newSelectedUser =
        selectedTeamId === 'allUsers'
          ? allUsersData.users.find(({ _id }) => _id !== userId) || {}
          : usersData.users.find(({ _id }) => _id !== userId) || {}

      handleClick(newSelectedUser[searchParamKey])
    },
    onError: alert,
  })

  if (usersLoading || allUsersLoading) return null
  if (usersError || allUsersError)
    return <div>{usersError || allUsersError}</div>

  const mutationObj = {
    mutationFunc: deleteUser,
    loading,
    error,
  }

  return (
    <DeleteButton
      itemId={userId}
      mutationObj={mutationObj}
      modalTitle="Delete User"
    />
  )
}
