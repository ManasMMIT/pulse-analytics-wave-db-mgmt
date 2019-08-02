import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
  GET_SELECTED_USER,
} from './queries'

import {
  SELECT_CLIENT,
  SELECT_TEAM,
  SELECT_USER,
} from './mutations'

import {
  createClient,
  createTeam,
  deleteTeam,
  editTeam,
  createUser,
  deleteUser,
  editUser,
} from './server-endpoints'

const resolvers = {
  Mutation: {
    selectedClient: async (_, { id }, { cache, client }) => {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })

      let selectedClient = clients[0]

      if (id) {
        selectedClient = clients.find(({ id: clientId }) => id === clientId)
      }

      client.writeQuery({ query: GET_SELECTED_CLIENT, data: { selectedClient } })

      await client.mutate({ mutation: SELECT_TEAM })

      return selectedClient
    },
    createdClient: async (_, { description }, { cache, client }) => {
      let createdClient = await createClient({ description })
      createdClient = { ...createdClient, __typename: 'Client' }

      const { clients } = cache.readQuery({ query: GET_CLIENTS })
      const clientsPlusNewClient = [...clients, createdClient]

      client.writeQuery({ query: GET_CLIENTS, data: { clients: clientsPlusNewClient } })

      await client.mutate({ mutation: SELECT_CLIENT, variables: { id: createdClient.id } })

      return createdClient
    },
    selectedTeam: async (_, { id }, { cache, client }) => {
      const { selectedClient: { id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

      const queryObjForClientTeams = {
        query: GET_CLIENT_TEAMS,
        variables: { clientId },
      }

      // TODO: make the following try...catch into a util
      let teams
      try {
        const data = cache.readQuery(queryObjForClientTeams)
        teams = data.teams
      } catch(e) {
        const response = await client.query(queryObjForClientTeams)
        teams = response.data.teams
      }

      let selectedTeam = teams[0]

      if (id) {
        selectedTeam = teams.find(({ id: teamId }) => id === teamId)
      }

      client.writeQuery({ query: GET_SELECTED_TEAM, data: { selectedTeam } })

      await client.mutate({ mutation: SELECT_USER })

      return selectedTeam
    },
    createdTeam: async (_, { description }, { cache, client }) => {
      const { selectedClient: { id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })
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

      await client.mutate({ mutation: SELECT_TEAM, variables: { id: createdTeam.id } })

      return createdTeam
    },
    deletedTeam: async (_, { id }, { cache, client }) => {
      const { selectedClient: { id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })
      let deletedTeam = await deleteTeam(id, { clientId })
      deletedTeam = { ...deletedTeam, __typename: 'Team' }

      const { teams } = cache.readQuery({
        query: GET_CLIENT_TEAMS,
        variables: { clientId }, // needed despite @export var in query itself
      })

      const teamsMinusDeletedTeam = teams.filter(({ id: teamId }) => teamId !== id)

      client.writeQuery({
        query: GET_CLIENT_TEAMS,
        variables: { clientId }, // needed despite @export var in query itself
        data: { teams: teamsMinusDeletedTeam },
      })

      await client.mutate({ mutation: SELECT_TEAM })

      return deletedTeam
    },
    updatedTeam: async (_, { description }, { cache, client }) => {
      const { selectedTeam: { id } } = cache.readQuery({ query: GET_SELECTED_TEAM })
      let editedTeam = await editTeam(id, { description })
      editedTeam = { ...editedTeam, isDefault: null, __typename: 'Team' }

      const { selectedClient: { id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

      const { teams } = cache.readQuery({
        query: GET_CLIENT_TEAMS,
        variables: { clientId }, // needed despite @export var in query itself
      })

      const targetTeamIdx = teams.findIndex(({ id: teamId }) => teamId === id)
      teams[targetTeamIdx] = editedTeam

      client.writeQuery({
        query: GET_CLIENT_TEAMS,
        variables: { clientId }, // needed despite @export var in query itself
        data: { teams },
      })

      return editedTeam
    },
    selectedUser: async (_, { id }, { cache, client }) => {
      let selectedTeam
      try {
        const data = cache.readQuery({ query: GET_SELECTED_TEAM })
        selectedTeam = data.selectedTeam
      } catch(e) {
        // ! Note: in actual application usage, this catch block should never
        // ! be hit because there'll always be a selected client and a
        // ! selected team in the cache already

        const response = await client.mutate({ mutation: SELECT_TEAM })
        selectedTeam = response.data.selectedTeam
      }

      const teamId = selectedTeam.id

      const queryObjForTeamUsers = {
        query: GET_TEAM_USERS,
        variables: { teamId },
      }

      // TODO: make the following try...catch into a util
      let users
      try {
        const data = cache.readQuery(queryObjForTeamUsers)
        users = data.users
      } catch(e) {
        const response = await client.query(queryObjForTeamUsers)
        users = response.data.users
      }

      let selectedUser = users[0]

      if (id) {
        selectedUser = users.find(({ id: userId }) => id === userId)
      }

      client.writeQuery({ query: GET_SELECTED_USER, data: { selectedUser } })
      return selectedUser
    },
    createdUser: async (
      _,
      { username, email, password, roles },
      { cache, client }
    ) => {
      const { selectedClient: { id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

      const body = { username, email, password, clientId, roles }

      let createdUser = await createUser(body)
      createdUser = { ...createdUser, __typename: 'User' }

      const { selectedTeam: { id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

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
        }
      }

      await client.mutate({ mutation: SELECT_USER, variables: { id: createdUser.id } })

      return createdUser
    },
    deletedUser: async (_, { id }, { cache, client }) => {
      let deletedUser = await deleteUser(id)
      deletedUser = { ...deletedUser, __typename: 'User' }

      const { selectedTeam: { id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

      const { users } = cache.readQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
      })

      const usersMinusDeletedTeam = users.filter(({ id: userId }) => userId !== id)

      client.writeQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
        data: { users: usersMinusDeletedTeam },
      })

      await client.mutate({ mutation: SELECT_USER })

      return deletedUser
    },
    updatedUser: async (
      _,
      { id, username, email, password, roles },
      { cache, client }
    ) => {
      let editedUser = await editUser(id, { username, email, password, roles })
      const newRoles = editedUser.roles.map(role => ({ ...role, __typename: 'Team' }))
      editedUser.roles = newRoles

      editedUser = { ...editedUser, __typename: 'User' }

      const { selectedTeam: { id: teamId } } = cache.readQuery({ query: GET_SELECTED_TEAM })

      let { users } = cache.readQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
      })

      if (roles.includes(teamId)) {
        const targetUserIdx = users.findIndex(({ id: userId }) => userId === id)
        users[targetUserIdx] = editedUser
      } else {
        users = users.filter(user => user.id !== id)
      }

      client.writeQuery({
        query: GET_TEAM_USERS,
        variables: { teamId }, // needed despite @export var in query itself
        data: { users },
      })

      return editedUser
    },
  },
}

export default resolvers
