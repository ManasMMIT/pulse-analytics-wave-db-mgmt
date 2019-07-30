import React from 'react'
import { Query } from 'react-apollo'

import { GET_SELECTED_CLIENT } from '../../api/queries'
import ClientsPanelItem from './ClientsPanelItem'

const ClientsPanelItems = ({ clients }) => (
  <Query query={GET_SELECTED_CLIENT}>
    {({ data: { selectedClient } }) => {
      return (
          <div>
            {
              clients.map(client => (
                <ClientsPanelItem
                  key={client.id}
                  selectedClient={selectedClient}
                  client={client}
                />
              ))
            }
          </div>
        )
    }}
  </Query>
)

export default ClientsPanelItems
