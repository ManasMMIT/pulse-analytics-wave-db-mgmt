import _ from 'lodash'

import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
} from '../../queries'

const clientQueryResolvers = {
  // This resolver has ONE JOB: to set a default client.
  // The mutation resolver `selectClient` handles cache updates.
  selectedClient: async (root, args, { client, cache }) => {
    let selectedClient
    try {
      selectedClient = cache.readQuery({ query: GET_SELECTED_CLIENT }).selectedClient
    } catch(e) {
      const {
        data: {
          clients,
        }
      } = await client.query({ query: GET_CLIENTS })

      selectedClient = clients[0]
    }

    return selectedClient
  },
}

export default clientQueryResolvers
