import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT
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
      debugger

      let selectedClient = clients[0]

      if (id) {
        selectedClient = clients.find(({ id: clientId }) => id === clientId)
      }

      cache.writeQuery({ query: GET_SELECTED_CLIENT, data: { selectedClient } })
      return selectedClient
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
