import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
  GET_TEAM_USERS,
  GET_SELECTED_USER,
} from './queries'

const resolvers = {
  // Query: {
  //   selectedClient: (obj, args, context, info) => {
  //     debugger
  //     return obj.clients[0]
  //   },
  // },
  Mutation: {
    selectedClient: (_, { id }, { cache, client }) => {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })

      let selectedClient = clients[0]

      if (id) {
        selectedClient = clients.find(({ id: clientId }) => id === clientId)
      }

      cache.writeQuery({ query: GET_SELECTED_CLIENT, data: { selectedClient } })
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
      return selectedTeam
    },
    selectedUser: async (_, { id }, { cache, client }) => {
      debugger

      // ! Note: a team should always be selected by the time a user selection
      // ! is made but if this is being resolver is hit in isolation, there
      // ! needs to be a default
      let selectedTeam
      try {
        const data = cache.readQuery({ query: GET_SELECTED_TEAM })
        selectedTeam = data.selectedTeam
      } catch(e) {
        debugger
        const response = await client.mutate({ query: GET_SELECTED_TEAM })
        debugger
        selectedTeam = response.data.selectedTeam
        debugger
      }

      const teamId = selectedTeam.id

      debugger

      const queryObjForTeamUsers = {
        query: GET_TEAM_USERS,
        variables: { teamId },
      }

      // TODO: make the following try...catch into a util
      let users
      try {
        const data = cache.readQuery(queryObjForTeamUsers)
        users = data.users
        debugger
      } catch(e) {
        const response = await client.query(queryObjForTeamUsers)
        users = response.data.users
        debugger
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
