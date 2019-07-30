import React from 'react'
import { Query, Mutation } from 'react-apollo'

import { SELECT_CLIENT } from '../../api/mutations'
import { GET_SELECTED_CLIENT } from '../../api/queries'
import ClientPanelItem from './ClientPanelItem'

const ClientsPanelItems = ({ clients }) => (
  <Query query={GET_SELECTED_CLIENT}>
    {({ data: { selectedClient } }) => {
      return (
        <Mutation mutation={SELECT_CLIENT}>
          {(handleSelect, { called }) => {
            if (!called) handleSelect()

            return (
              <div>
                {
                  clients.map(client => (
                    <ClientPanelItem
                      key={client.id}
                      handleSelect={handleSelect}
                      selectedClient={selectedClient}
                      client={client}
                    />
                  ))
                }
              </div>
            )
          }}
        </Mutation>
      )
    }}
  </Query>
)

export default ClientsPanelItems
