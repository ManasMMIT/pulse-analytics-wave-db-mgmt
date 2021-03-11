import React from 'react'
import { useQuery } from '@apollo/client'

import CreateTeamButton from './TeamForm/Button'

import {
  CREATE_TEAM,
  MANAGE_CREATED_TEAM,
} from '../../../api/mutations'

import {
  GET_SELECTED_CLIENT,
} from '../../../api/queries'

import { Colors } from '../../../utils/pulseStyles'

const CreateButton = () => {
  const { data, loading } = useQuery(GET_SELECTED_CLIENT)

  if (loading) return null
  const { selectedClient: { _id: clientId } } = data

  return (
    <CreateTeamButton
      modalTitle="Create Team"
      buttonLabel="Create Team"
      clientId={clientId}
      buttonColor={Colors.PRIMARY}
      mutationDoc={CREATE_TEAM}
      clientMutation={MANAGE_CREATED_TEAM}
    />
  )
}

export default CreateButton
