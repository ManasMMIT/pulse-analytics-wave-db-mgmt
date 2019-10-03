import React from 'react'
import { Query } from 'react-apollo'

import UserFormButton from './UserForm/Button'

import {
  CREATE_USER,
  MANAGE_CREATED_USER,
} from '../../../api/mutations'

import {
  GET_SELECTED_TEAM,
} from '../../../api/queries'

const CreateButton = () => (
  <Query query={GET_SELECTED_TEAM}>
    {
      ({ data, loading }) => {
        if (loading) return null

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
      }}
  </Query>
)

export default CreateButton
