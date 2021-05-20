import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import UserForm from './UserForm'
import Spinner from 'frontend/components/Spinner'

import { GET_USER_TEAMS } from '../../../../api/queries'

const UserFormContainer = ({
  userData,
  selectedTeamId,
  afterSubmitHook,
  mutationDoc,
  additionalFormData,
  handleClick,
}) => {
  const { _id: userId } = userData

  const { data, loading, error } = useQuery(GET_USER_TEAMS, {
    variables: { userId },
  })

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
      userData={userData}
      selectedTeamId={selectedTeamId}
      allTeamsUserIsOn={data.teams}
      afterSubmitHook={afterSubmitHook}
      additionalFormData={additionalFormData}
      handleClick={handleClick}
    />
  )
}

UserFormContainer.propTypes = UserForm.propTypes

UserFormContainer.defaultProps = UserForm.defaultProps

export default UserFormContainer
