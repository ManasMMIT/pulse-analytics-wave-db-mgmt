import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import UserFormButton from './UserForm/Button'

import { Colors } from '../../../utils/pulseStyles'

import {
  CREATE_USER,
  MANAGE_CREATED_USER,
} from '../../../api/mutations'

import {
  GET_SELECTED_TEAM,
} from '../../../api/queries'

const CreateButton = () => {
  const { data, loading, error } = useQuery(GET_SELECTED_TEAM)
  if (loading) return null
  if (error) return <div>{error}</div>

  const { selectedTeam } = data

  return (
    <UserFormButton
      modalTitle="Create User"
      buttonLabel="Create User"
      buttonColor={Colors.PRIMARY}
      selectedTeamId={selectedTeam._id}
      mutationDoc={CREATE_USER}
      additionalFormData={{ clientId: selectedTeam.client._id }}
      clientMutation={MANAGE_CREATED_USER}
    />
  )
}
export default CreateButton
