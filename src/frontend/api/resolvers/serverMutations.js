/*
  ! THESE MUTATIONS ARE SUPPOSED TO EVENTUALLY MOVE TO SERVER SIDE.
  ! The client-side side effects that are built into the resolvers
  ! would then have to reconfigured.
*/

import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
} from '../queries'

import {
  SELECT_CLIENT,
  SELECT_TEAM,
  SELECT_USER,
} from '../mutations'

import {
  createClient,
  createTeam,
  deleteTeam,
  editTeam,
  createUser,
  deleteUser,
  editUser,
} from '../server-endpoints'

const serverMutations = {
  createClient: async (_, { description }, { cache, client }) => {
    let createdClient = await createClient({ description })
    createdClient = { ...createdClient, __typename: 'Client' }

    const { clients } = cache.readQuery({ query: GET_CLIENTS })
    const clientsPlusNewClient = [...clients, createdClient]

    client.writeQuery({ query: GET_CLIENTS, data: { clients: clientsPlusNewClient } })

    await client.mutate({ mutation: SELECT_CLIENT, variables: { _id: createdClient._id } })

    return createdClient
  },
  createTeam: async (_, { description }, { cache, client }) => {
    const { selectedClient: { _id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })
    let createdTeam = await createTeam({ description, clientId })
    createdTeam = { ...createdTeam, __typename: 'Team' }

    const { teams } = cache.readQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
    })

    const teamsPlusNewTeam = [...teams, createdTeam]

    client.writeQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
      data: { teams: teamsPlusNewTeam },
    })

    await client.mutate({ mutation: SELECT_TEAM, variables: { _id: createdTeam._id } })

    return createdTeam
  },
  deleteTeam: async (_, { _id: teamId }, { cache, client }) => {
    const { selectedClient: { _id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })
    let deletedTeam = await deleteTeam(teamId, { clientId })
    deletedTeam = { ...deletedTeam, __typename: 'Team' }

    const { teams } = cache.readQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
    })

    const teamsMinusDeletedTeam = teams.filter(({ _id }) => teamId !== _id)

    client.writeQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
      data: { teams: teamsMinusDeletedTeam },
    })

    await client.mutate({ mutation: SELECT_TEAM })

    return deletedTeam
  },
  updateTeam: async (_, { description }, { cache, client }) => {
    const { selectedTeam: { _id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })
    let editedTeam = await editTeam(teamId, { description })
    editedTeam = { ...editedTeam, isDefault: null, __typename: 'Team' }

    const { selectedClient: { _id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    const { teams } = cache.readQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
    })

    const targetTeamIdx = teams.findIndex(({ _id }) => teamId === _id)
    teams[targetTeamIdx] = editedTeam

    client.writeQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
      data: { teams },
    })

    return editedTeam
  },
  createUser: async (
    _,
    { username, email, password, roles },
    { cache, client }
  ) => {
    const { selectedClient: { _id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    const body = { username, email, password, clientId, roles }

    let createdUser = await createUser(body)
    createdUser = { ...createdUser, __typename: 'User' }

    const { selectedTeam: { _id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

    for (const roleId of roles) {
      // update the slice of cache for list of users for the selected team
      // ONLY IF the user has been added to the selected team; otherwise,
      // do nothing because if the user has been added to other teams
      // that user will be refetched from backend when those other teams are selected
      if (teamId === roleId) {
        const { users: prevUsers } = cache.readQuery({
          query: GET_TEAM_USERS,
          variables: { teamId }, // needed despite @export var in query itself
        })

        const nextUsers = [...prevUsers, createdUser]

        client.writeQuery({
          query: GET_TEAM_USERS,
          variables: { teamId }, // needed despite @export var in query itself
          data: { users: nextUsers },
        })

        await client.mutate({ mutation: SELECT_USER, variables: { _id: createdUser._id } })
      }
    }

    return createdUser
  },
  deleteUser: async (_, { _id: userId }, { cache, client }) => {
    let deletedUser = await deleteUser(userId)
    deletedUser = { ...deletedUser, __typename: 'User' }

    const { selectedTeam: { _id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

    const { users } = cache.readQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
    })

    const usersMinusDeletedTeam = users.filter(({ _id }) => userId !== _id)

    client.writeQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
      data: { users: usersMinusDeletedTeam },
    })

    await client.mutate({ mutation: SELECT_USER })

    return deletedUser
  },
  updateUser: async (
    _,
    { _id, username, email, password, roles },
    { cache, client }
  ) => {
    let editedUser = await editUser(_id, { username, email, password, roles })

    editedUser = { __typename: 'User', ...editedUser }

    const { selectedTeam: { _id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

    let { users } = cache.readQuery({
      query: GET_TEAM_USERS,
      variables: { teamId }, // needed despite @export var in query itself
    })

    const updateGetTeamUsers = users => (
      client.writeQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
        data: { users },
      })
    )

    if (roles.includes(teamId)) {
      const targetUserIdx = users.findIndex(({ _id: userId }) => userId === _id)
      users[targetUserIdx] = editedUser
      updateGetTeamUsers(users)

      // if user is part of the currently selected team, there's no need
      // to reselect the same user (when that user's edit button is clicked
      // his changed roles, if any, will be fetched
    } else {
      users = users.filter(user => user._id !== _id)
      updateGetTeamUsers(users)

      // the user doesn't belong to the selected role anymore; pick the first user
      // for the selected role
      await client.mutate({ mutation: SELECT_USER })
    }

    return editedUser
  },
}

export default serverMutations
