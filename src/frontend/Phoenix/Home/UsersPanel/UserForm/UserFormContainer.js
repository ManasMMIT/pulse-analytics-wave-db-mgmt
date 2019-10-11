import React from 'react'
import PropTypes from 'prop-types'
import {
  useQuery,
} from '@apollo/react-hooks'

import UserForm from './UserForm'
import Spinner from '../../../shared/Spinner'

import {
  GET_USER_TEAMS,
} from '../../../../api/queries'

const UserFormContainer = ({
  user: {
    _id: userId,
    username,
    email,
  },
  selectedTeamId,
  afterSubmitHook,
  mutationDoc,
  clientMutation,
  additionalFormData,
}) => {
  const { data, loading, error } = useQuery(
    GET_USER_TEAMS,
    { variables: { userId } }
  )

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner />
  
  // ! If data doesn't have teams, don't render form
  if (!data.teams) return null

  /*
    ! If there are user teams, but no userId, updating will fail
    ! else if there aren't user teams, but there is a userId,
    ! we're assuming you're trying to create a user while holding an old id
  */
  if (data.teams.length) {
    if (!userId) return null
  } else {
    if (userId) return null
  }

  return (
    <UserForm
      mutationDoc={mutationDoc}
      clientMutation={clientMutation}
      userId={userId}
      username={username}
      email={email}
      selectedTeamId={selectedTeamId}
      allTeamsUserIsOn={data.teams}
      afterSubmitHook={afterSubmitHook}
      additionalFormData={additionalFormData}
    />
  )
}

UserFormContainer.propTypes = {
  user: PropTypes.object,
  selectedTeamId: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  afterSubmitHook: PropTypes.func,
  mutationDoc: PropTypes.object,
  clientMutation: PropTypes.object,
}

UserFormContainer.defaultProps = {
  user: {
    _id: null, // undefined somehow fetches all teams
  },
  selectedTeamId: null,
  afterSubmitHook: () => null,
  mutationDoc: null,
  clientMutation: null,
}

export default UserFormContainer
