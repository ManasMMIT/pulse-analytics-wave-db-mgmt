import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import UserFormButton from './UserForm/Button'

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
      buttonStyle={{ background: '#d4e2f2', color: '#1d66b8' }}
      selectedTeamId={selectedTeam._id}
      mutationDoc={CREATE_USER}
      additionalFormData={{ clientId: selectedTeam.client._id }}
      clientMutation={MANAGE_CREATED_USER}
    />
  )
}
export default CreateButton
