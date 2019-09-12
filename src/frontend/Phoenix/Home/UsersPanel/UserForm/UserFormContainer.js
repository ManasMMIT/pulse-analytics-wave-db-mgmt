import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import Spinner from '../../../shared/Spinner'

import UserForm from './UserForm'

import { GET_USER_TEAMS } from '../../../../api/queries'

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
  // * network-only is to keep the user team's fresh by
  // * always hitting the backend resolver when UserFormContainer mounts
  // ! This means that this part of the CACHE IS BEHIND before a subsequent mount
  // * you can view the cache in dev tools on local with __APOLLO_CLIENT__.cache.data.data.ROOT_QUERY
  // ? Docs: https://www.apollographql.com/docs/react/api/react-apollo/#graphql-config-options-fetchPolicy

  return (
    <Query
      query={GET_USER_TEAMS}
      variables={{ userId }}
      fetchPolicy="network-only"
    >
      {
        ({ data, loading, error }) => {
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
              afterSubmitHook={afterSubmitHook}
              mutationDoc={mutationDoc}
              clientMutation={clientMutation}
              additionalFormData={additionalFormData}
            />
          )
        }
      }
    </Query>
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
