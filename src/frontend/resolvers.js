const resolvers = {
  Query: {
    selectedClient: (obj, args, context, info) => {
      obj.selectedClient = obj.clients[0]
      return obj.selectedClient
    },
  }
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
