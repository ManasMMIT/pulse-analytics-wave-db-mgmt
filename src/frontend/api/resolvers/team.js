import {
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
  GET_USER_TEAMS,
} from '../queries'

import {
  SELECT_USER,
  SELECT_TEAM,
} from '../mutations'

const teamResolvers = {
  selectTeam: async (_, { _id: teamId }, { cache, client }) => {
    const { selectedClient: { _id: clientId } } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    const queryObjForClientTeams = {
      query: GET_CLIENT_TEAMS,
      variables: { clientId },
    }

    let teams
    try {
      const data = cache.readQuery(queryObjForClientTeams)
      teams = data.teams
    } catch (e) {
      const response = await client.query(queryObjForClientTeams)
      teams = response.data.teams
    }

    let selectedTeam = teams[0]

    if (teamId) {
      selectedTeam = teams.find(({ _id }) => _id === teamId)
    }

    client.writeQuery({ query: GET_SELECTED_TEAM, data: { selectedTeam } })

    await client.mutate({ mutation: SELECT_USER })

    return selectedTeam
  },
  manageCreatedTeam: async (parent, { data: { createTeam } }, { client, cache}) => {
    const {
      selectedClient: {
        _id: clientId
      }
    } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    const { teams } = cache.readQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
    })

    const teamsPlusNewTeam = [...teams, createTeam]

    cache.writeQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
      data: { teams: teamsPlusNewTeam },
    })

    await client.mutate({
      mutation: SELECT_TEAM,
      variables: { _id: createTeam._id }
    })

    return createTeam
  },
  manageDeletedTeam: async (parent, { data: { deleteTeam }}, { client, cache }) => {
    const {
      users,
    } = cache.readQuery({
      query: GET_TEAM_USERS,
      variables: {
        teamId: deleteTeam._id
      }
    })

    // for all team users, refresh their user teams query
    users.forEach(user => {
      const { teams } = client.readQuery({
        query: GET_USER_TEAMS,
        variables: {
          userId: user._id,
        }
      })

      const updatedTeams = teams.filter(({ _id }) => _id !== deleteTeam._id)

      client.writeQuery({
        query: GET_USER_TEAMS,
        variables: {
          userId: user._id,
        },
        data: {
          teams: updatedTeams,
        }
      })
    })

    const {
      selectedClient: {
        _id: clientId
      }
    } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    const { teams } = cache.readQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
    })

    const teamsMinusDeletedTeam = teams
      .filter(({ _id }) => deleteTeam._id !== _id)

    client.writeQuery({
      query: GET_CLIENT_TEAMS,
      variables: { clientId }, // needed despite @export var in query itself
      data: { teams: teamsMinusDeletedTeam },
    })

    await client.mutate({ mutation: SELECT_TEAM })

    return deleteTeam
  },
  manageUpdatedTeam: async (parent, { data: { updateTeam } }, { cache, client }) => {
    const {
      selectedTeam: {
        _id: teamId
      }
    } = cache.readQuery({ query: GET_SELECTED_TEAM })

    const editedTeam = {
      ...updateTeam,
      isDefault: null,
      __typename: 'Team',
    }

    const {
      selectedClient: {
        _id: clientId
      }
    } = cache.readQuery({ query: GET_SELECTED_CLIENT })

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

    client.writeQuery({
      query: GET_SELECTED_TEAM,
      data: { selectedTeam: editedTeam }
    })

    // network-only necessary here because we need to force refresh this slice of the cache
    // after potentially cascade updating the users' default landing -- 
    // the same force refresh is done upon SELECT_USER, but it's not fast enough; the edit user
    // modal can open with outdated default landing string
    await client.query({
      query: GET_TEAM_USERS,
      variables: { teamId },
      fetchPolicy: 'network-only',
    })

    return editedTeam
  }
}

export default teamResolvers
