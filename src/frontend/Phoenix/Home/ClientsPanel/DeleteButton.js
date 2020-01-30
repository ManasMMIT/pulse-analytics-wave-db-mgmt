import React from 'react'

import DeleteButton from '../../shared/DeleteButton'

import {
  DELETE_CLIENT,
  MANAGE_DELETED_CLIENT,
} from '../../../api/mutations'

export default ({ clientId }) => (
  <DeleteButton
    style={{ color: 'white' }}
    itemId={clientId}
    mutationDoc={DELETE_CLIENT}
    clientMutation={MANAGE_DELETED_CLIENT}
  />
)
