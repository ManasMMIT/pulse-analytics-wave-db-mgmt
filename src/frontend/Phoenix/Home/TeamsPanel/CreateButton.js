import React from 'react'
import { Query } from 'react-apollo'

import TextFormButton from '../../shared/TextForm/Button'

import {
  CREATE_TEAM,
  MANAGE_CREATED_TEAM,
} from '../../../api/mutations'

import {
  GET_SELECTED_CLIENT,
} from '../../../api/queries'

const createButtonStyle = {
  background: '#d4e2f2',
  color: '#1d66b8',
}

const CreateButton = () => (
  <Query query={GET_SELECTED_CLIENT}>
    {({ data, loading }) => {
      if (loading) return null

      const { selectedClient: { _id: clientId } } = data

      return (
        <TextFormButton
          modalTitle="Create Team"
          buttonLabel="Create Team"
          additionalFormData={{ clientId }}
          buttonStyle={createButtonStyle}
          mutationDoc={CREATE_TEAM}
          clientMutation={MANAGE_CREATED_TEAM}
        />
      )
    }}
  </Query>
)

export default CreateButton
