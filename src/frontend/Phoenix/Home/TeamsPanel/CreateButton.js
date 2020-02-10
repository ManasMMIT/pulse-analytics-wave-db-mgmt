import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import TextFormButton from '../../shared/TextForm/Button'

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
    <TextFormButton
      modalTitle="Create Team"
      buttonLabel="Create Team"
      additionalFormData={{ clientId }}
      buttonColor={Colors.PRIMARY}
      mutationDoc={CREATE_TEAM}
      clientMutation={MANAGE_CREATED_TEAM}
    />
  )
}

export default CreateButton
