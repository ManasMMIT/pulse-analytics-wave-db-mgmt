import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Spinner from '../../../shared/Spinner'

import UserForm from './UserForm'

import { GET_USER_TEAMS } from '../../../../api/queries'

const UserFormContainer = ({
  userId,
  username,
  email,
  selectedTeamId,
  afterSubmitHook,
  mutationDoc,
}) => {
  return (
    <Query query={GET_USER_TEAMS} variables={{ userId }}>
      {
        ({ data, loading, error, refetch }) => {
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
              userId={userId}
              username={username}
              email={email}
              selectedTeamId={selectedTeamId}
              allTeamsUserIsOn={data.teams}
              afterSubmitHook={() => refetch().then(afterSubmitHook)} // refresh user's roles in cache
              mutationDoc={mutationDoc}
            />
          )
        }
      }
    </Query>
  )
}

UserFormContainer.propTypes = {
  userId: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  selectedTeamId: PropTypes.string,
  allTeamsUserIsOn: PropTypes.array,
  afterSubmitHook: PropTypes.func,
  mutationDoc: PropTypes.object,
}

UserFormContainer.defaultProps = {
  userId: null,
  username: '',
  email: '',
  selectedTeamId: null,
  afterSubmitHook: () => null,
  mutationDoc: null,
}

export default UserFormContainer
