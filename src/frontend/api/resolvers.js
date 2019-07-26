import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
} from './queries'

const resolvers = {
  // Query: {
  //   selectedClient: (obj, args, context, info) => {
  //     debugger
  //     return obj.clients[0]
  //   },
  // },
  Mutation: {
    selectedClient: (_, { id }, { cache }) => {
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
  },
  // Mutation: {
  //   addOrRemoveFromCart: (_, { id }, { cache }) => {
  //     const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
  //     const data = {
  //       cartItems: cartItems.includes(id)
  //         ? cartItems.filter(i => i !== id)
  //         : [...cartItems, id],
  //     }
  //     cache.writeQuery({ query: GET_CART_ITEMS, data })
  //     return data.cartItems
  //   },
  // },
}

export default resolvers
