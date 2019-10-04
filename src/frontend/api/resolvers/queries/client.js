import _ from 'lodash'

import {
  GET_CLIENTS,
} from '../../queries'

const clientQueryResolvers = {
  // This resolver has ONE JOB: to set a default client.
  // The mutation resolver `selectClient` handles cache updates.
  selectedClient: async (root, args, { cache }) => {
    let result = root.selectedClient

    if (!root.selectedClient) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })

      result = clients[0]
    }

    return result
  },
}

export default clientQueryResolvers
