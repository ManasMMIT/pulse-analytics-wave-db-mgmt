import {
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
  GET_SELECTED_USER,
  GET_USER_TEAMS,
} from '../queries'

import {
  SELECT_TEAM,
  SELECT_USER,
} from '../mutations'

const userResolvers = {
  selectUser: async (_, { _id: userId }, { cache, client }) => {
    let selectedTeam
    try {
      const data = cache.readQuery({ query: GET_SELECTED_TEAM })
      selectedTeam = data.selectedTeam
    } catch (e) {
      // ! Note: in actual application usage, this catch block should never
      // ! be hit because there'll always be a selected client and a
      // ! selected team in the cache already

      const response = await client.mutate({ mutation: SELECT_TEAM })
      selectedTeam = response.data.selectedTeam
    }

    const teamId = selectedTeam._id

    // `network-only` is not necessary because refreshing of
    // `GET_TEAM_USERS is handled on user update -- see `manageUpdatedUser` writeQuery
    const { data: { users } } = await client.query({
      query: GET_TEAM_USERS,
      variables: { teamId },
    })

    let selectedUser = users[0]

    if (userId) {
      selectedUser = users.find(({ _id }) => _id === userId)
    }

    client.writeQuery({ query: GET_SELECTED_USER, data: { selectedUser } })

    return selectedUser
  },
  manageCreatedUser: async (
    _,
    {
      data: {
        createUser: createdUser
      }
    },
    { cache, client }) => {
    const {
      selectedTeam: {
        _id: teamId
      }
    } = cache.readQuery({ query: GET_SELECTED_TEAM })

    const { data: { teams } } = await client.query({
      query: GET_USER_TEAMS,
      variables: { userId: createdUser._id },
    })

    for (const team of teams) {
      // update the slice of cache for list of users for the selected team
      // ONLY IF the user has been added to the selected team; otherwise,
      // do nothing because if the user has been added to other teams
      // that user will be refetched from backend when those other teams are selected
      if (teamId === team._id) {
        const { users: prevTeamUsers } = cache.readQuery({
          query: GET_TEAM_USERS,
          variables: { teamId }, // needed despite @export var in query itself
        })

        const nextTeamUsers = [...prevTeamUsers, createdUser]

        client.writeQuery({
          query: GET_TEAM_USERS,
          variables: { teamId }, // needed despite @export var in query itself
          data: { users: nextTeamUsers },
        })

        await client.mutate({
          mutation: SELECT_USER,
          variables: { _id: createdUser._id }
        })
      }
    }

    return createdUser
  },
  manageDeletedUser: async (_, { data: { deleteUser }}, { cache, client }) => {
    const deletedUser = { ...deleteUser, __typename: 'User' }
    const {
      selectedTeam: {
        _id: teamId,
      }
    } = cache.readQuery({ query: GET_SELECTED_TEAM })

    const { users } = cache.readQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
    })

    const usersMinusDeletedTeam = users.filter(({ _id }) => deletedUser._id !== _id)

    client.writeQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
      data: { users: usersMinusDeletedTeam },
    })

    await client.mutate({ mutation: SELECT_USER })

    return deletedUser
  },
  manageUpdatedUser: async (_, { data: { updateUser } }, { cache, client}) => {
    const editedUser = { __typename: 'User', ...updateUser }

    const { selectedTeam: { _id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

    let { users } = cache.readQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
    })

    const updateGetTeamUsers = updatedUsers => (
      client.writeQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
        data: { users: updatedUsers },
      })
    )

    // ! https://www.apollographql.com/docs/react/api/react-hoc/#optionsfetchpolicy
    // ! The default fetchPolicy, cache-first, doesn't appear to actually write to the cache post query.
    // ? network-only does seem to write to the cache
    // ? no-cache also seems to write to the cache,
    // ? although the docs seem to say it doesn't (9/11/19)

    /*
      This network-only fetchPolicy is being used to
      set the cache after a user is updated, keeping the cache fresh with the latest user's teams. When the modal with the user form is opened again, the form draws on the updated cache.
    */
    const { data: { teams } } = await client.query({
      query: GET_USER_TEAMS,
      variables: { userId: editedUser._id },
      fetchPolicy: 'network-only',
    })

    if (teams.find(({ _id }) => _id === teamId)) {
      const targetUserIdx = users.findIndex(({ _id: userId }) => userId === editedUser._id)
      users[targetUserIdx] = editedUser
      updateGetTeamUsers(users)

      // if user is part of the currently selected team, there's no need
      // to reselect the same user (when that user's edit button is clicked
      // his changed roles, if any, will be fetched
    } else {
      users = users.filter(user => user._id !== editedUser._id)

      // if GET_TEAM_USERS is not written to, then the selectUser mutation will use an outdated slice of cache for selecting a default first user.
      updateGetTeamUsers(users)

      // the user doesn't belong to the selected role anymore; pick the first user
      // for the selected role
      await client.mutate({ mutation: SELECT_USER })
    }

    return editedUser
  },
}

export default userResolvers
