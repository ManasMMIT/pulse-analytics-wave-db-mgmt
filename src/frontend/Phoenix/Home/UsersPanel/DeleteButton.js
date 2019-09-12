import React from 'react'

import DeleteButton from '../../shared/DeleteButton'

import {
  DELETE_USER,
  MANAGE_DELETED_USER,
} from '../../../api/mutations'

export default ({ userId }) => (
  <DeleteButton
    itemId={userId}
    mutationDoc={DELETE_USER}
    clientMutation={MANAGE_DELETED_USER}
  />
)
