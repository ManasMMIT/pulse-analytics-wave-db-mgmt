import React from 'react'
import { Mutation } from 'react-apollo'

import { SELECT_CLIENT } from '../../api/mutations'
import ClientPanelItem from './ClientPanelItem'

const ClientsPanelItems = ({ clients }) => (
  <Mutation mutation={SELECT_CLIENT}>
    {(handleSelect, { data: selectedEntityData, called }) => {
      if (!called) handleSelect()

      return (
        <div>
          {
            clients.map(client => (
              <ClientPanelItem
                key={client.id}
                handleSelect={handleSelect}
                selectedEntityData={selectedEntityData}
                client={client}
              />
            ))
          }
        </div>
      )
    }}
  </Mutation>
)

export default ClientsPanelItems
