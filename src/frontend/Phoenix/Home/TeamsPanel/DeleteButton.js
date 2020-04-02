import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import DeleteButton from '../../shared/DeleteButton'

import {
  DELETE_TEAM,
  MANAGE_DELETED_TEAM,
} from '../../../api/mutations'

import {
  GET_SELECTED_CLIENT,
} from '../../../api/queries'

export default ({ teamId }) => {
  const { data, loading } = useQuery(GET_SELECTED_CLIENT)

  if (loading) return null

  const { selectedClient } = data

  return (
    <DeleteButton
      itemId={teamId}
      mutationDoc={DELETE_TEAM}
      additionalFormData={{ clientId: selectedClient._id }}
      clientMutation={MANAGE_DELETED_TEAM}
      modalTitle="Delete Team"
    />
  )
}
