import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { lighten } from 'polished'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useMutation } from '@apollo/react-hooks'

import Spinner from 'frontend/components/Spinner'
import { Colors } from '../../../../utils/pulseStyles'
import { GET_TEAMS, GET_USERS, GET_USER_TEAMS } from 'frontend/api/queries'

const Button = styled.button(
  {
    background: Colors.PRIMARY,
    border: 'none',
    borderRadius: 4,
    color: Colors.WHITE,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    padding: '12px 24px',
    width: 'auto',
    ':hover': {
      background: lighten(0.1, Colors.PRIMARY),
    },
  },
  ({ disabled }) =>
    disabled
      ? {
          background: Colors.LIGHT_GRAY_1,
          color: Colors.BLACK,
          cursor: 'not-allowed',
          ':hover': { background: Colors.LIGHT_GRAY_1 },
        }
      : {}
)

const SubmitButton = ({
  mutationDoc,
  afterSubmitHook,
  input,
  isDisabled,
  handleClick,
}) => {
  const location = useLocation()

  const { clientId: selectedClientId, userId: selectedUserId } =
    (location.search && queryString.parse(location.search)) || {}

  const [updateUser, { loading, error }] = useMutation(mutationDoc, {
    update: (cache, { data }) => {
      const firstDataKey = Object.keys(data)[0]
      const updateUser = data[firstDataKey]

      const { teams: teamsData } = cache.readQuery({
        query: GET_TEAMS,
        variables: { clientId: selectedClientId },
      })

      let newUserTeams = teamsData.filter(({ _id }) =>
        input.roles.includes(_id)
      )
      newUserTeams = newUserTeams.map(
        ({ _id, name, description, isDefault, __typename }) => ({
          _id,
          name,
          description,
          isDefault,
          __typename,
        })
      )
      cache.writeQuery({
        query: GET_USER_TEAMS,
        data: { teams: newUserTeams },
        variables: { userId: updateUser._id },
      })

      teamsData.forEach(({ _id }) => {
        const { users: tempUsers } = cache.readQuery({
          query: GET_USERS,
          variables: { teamId: _id },
        })

        const newUsers = tempUsers.filter(({ _id }) => _id !== updateUser._id)
        if (input.roles.includes(_id)) {
          let i = 0
          while (
            i < newUsers.length &&
            newUsers[i].username.toLowerCase() <
              updateUser.username.toLowerCase()
          ) {
            i++
          }
          newUsers.splice(i, 0, updateUser)
        }

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

      const newAllUsers = tempAllUsers.filter(
        ({ _id }) => _id !== updateUser._id
      )
      let i = 0
      while (
        i < newAllUsers.length &&
        newAllUsers[i].username.toLowerCase() <
          updateUser.username.toLowerCase()
      ) {
        i++
      }
      newAllUsers.splice(i, 0, updateUser)

      cache.writeQuery({
        query: GET_USERS,
        data: { users: newAllUsers },
        variables: { clientId: selectedClientId },
      })
    },
    onCompleted: (data) => {
      const firstDataKey = Object.keys(data)[0]
      const updateUser = data[firstDataKey]
      if (!selectedUserId || selectedUserId !== updateUser._id)
        handleClick(updateUser._id)
    },
    onError: alert,
  })

  if (loading) return <Spinner />

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error.message}</div>
  }

  return (
    <Button
      disabled={isDisabled}
      type="submit"
      onClick={() =>
        updateUser({
          variables: { input },
        }).then(afterSubmitHook)
      }
    >
      Submit
    </Button>
  )
}

SubmitButton.propTypes = {
  mutationDoc: PropTypes.object,
  afterSubmitHook: PropTypes.func,
  input: PropTypes.object,
  handleClick: PropTypes.func,
}

SubmitButton.defaultProps = {
  isDisabled: false,
}

export default SubmitButton
