import _ from 'lodash'

import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
} from '../queries'

import {
  SELECT_TEAM,
  SELECT_CLIENT,
} from '../mutations'

const clientResolvers = {
  selectClient: async (parent, { _id: clientId }, { cache, client }) => {
    const { clients } = cache.readQuery({ query: GET_CLIENTS })

    let selectedClient = clients[0]

    if (clientId) {
      selectedClient = clients.find(({ _id }) => _id === clientId)
    }

    debugger
    client.writeQuery({ query: GET_SELECTED_CLIENT, data: { selectedClient } })
    debugger

    // await client.mutate({ mutation: SELECT_TEAM })

    return selectedClient
  },
  manageCreatedClient: async (parent, { data: { createClient } }, { client, cache }) => {
    const createdClient = {
      ...createClient,
      __typename: 'Client',
    }

    const queryObj = {
      query: GET_CLIENTS
    }

    const {
      clients: originalClients,
    } = cache.readQuery(queryObj)

    const newEntities = _.sortBy(
      [...originalClients, createdClient],
      (({ description }) => description.toLowerCase())
    )

    cache.writeQuery({
      ...queryObj,
      data: { clients: newEntities }
    })

    await client.mutate({
      mutation: SELECT_CLIENT,
      variables: {
        _id: createdClient._id,
      }
    })

    return createdClient
  }
}

export default clientResolvers
