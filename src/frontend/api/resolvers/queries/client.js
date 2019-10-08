import _ from 'lodash'

import {
  GET_CLIENTS,
  GET_SELECTED_CLIENT,
} from '../../queries'

const clientQueryResolvers = {
  // This resolver has ONE JOB: to replace dummy initial client
  // with default client (first client) from clients list.
  // The mutation resolver `selectClient` handles cache updates.
  selectedClient: async (root, args, { client, cache }) => {
    
    const { selectedClient } = cache.readQuery({ query: GET_SELECTED_CLIENT })
    
    let result = selectedClient
    
    if (selectedClient._id === 'initialClient') {
      const {
        data: {
          clients,
        }
      } = await client.query({ query: GET_CLIENTS })
      
      result = clients[0]
    }
    
    console.log('Selected Client Resolver', result);
    return result
  },
}

export default clientQueryResolvers
