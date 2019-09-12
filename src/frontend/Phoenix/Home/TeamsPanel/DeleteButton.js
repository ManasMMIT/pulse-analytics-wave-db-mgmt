import React from 'react'
import { Query } from 'react-apollo'

import DeleteButton from '../../shared/DeleteButton'

import {
  DELETE_TEAM,
  MANAGE_DELETED_TEAM,
} from '../../../api/mutations'

import {
  GET_SELECTED_CLIENT,
} from '../../../api/queries'

export default ({ teamId }) => (
  <Query query={GET_SELECTED_CLIENT}>
    {({ data: { selectedClient } }) => (
      <DeleteButton
        itemId={teamId}
        mutationDoc={DELETE_TEAM}
        additionalFormData={{ clientId: selectedClient._id }}
        clientMutation={MANAGE_DELETED_TEAM}
      />
    )}
  </Query>
)
