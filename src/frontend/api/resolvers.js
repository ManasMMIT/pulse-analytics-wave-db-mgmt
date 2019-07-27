import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
  GET_SELECTED_USER,
} from './queries'

import {
  SELECT_TEAM,
  SELECT_USER,
} from './mutations'

const resolvers = {
  // Query: {
  //   selectedClient: (obj, args, context, info) => {
  //     debugger
  //     return obj.clients[0]
  //   },
  // },
  Mutation: {
    selectedClient: async (_, { id }, { cache, client }) => {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })

      let selectedClient = clients[0]

      if (id) {
        selectedClient = clients.find(({ id: clientId }) => id === clientId)
      }

      cache.writeQuery({ query: GET_SELECTED_CLIENT, data: { selectedClient } })

      await client.mutate({ mutation: SELECT_TEAM })

      return selectedClient
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

      cache.writeQuery({ query: GET_SELECTED_TEAM, data: { selectedTeam } })

      await client.mutate({ mutation: SELECT_USER })

      return selectedTeam
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

      cache.writeQuery({ query: GET_SELECTED_USER, data: { selectedUser } })
      return selectedUser
    },
    // ! Sample resolver:
    // addOrRemoveFromCart: (_, { id }, { cache }) => {
    //   const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
    //   const data = {
    //     cartItems: cartItems.includes(id)
    //       ? cartItems.filter(i => i !== id)
    //       : [...cartItems, id],
    //   }
    //   cache.writeQuery({ query: GET_CART_ITEMS, data })
    //   return data.cartItems
    // },
  },
}

export default resolvers
