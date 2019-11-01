import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { GET_SELECTED_TEAM } from '../../../../../../../api/queries'
import { UPDATE_PERMISSIONS } from '../../../../../../../api/mutations/teams'
import Spinner from '../../../../../../shared/Spinner'

const submitButtonStyle = {
  backgroundColor: '#0668D9',
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
  padding: 6,
  cursor: 'pointer',
}

const SubmitButton = ({
  nodeId,
  teamId,
  updatedResources,
  afterSubmitHook,
}) => {
  const [updatePermissions, { loading, error }] = useMutation(
    UPDATE_PERMISSIONS,
    {
      variables: { input: { nodeId, teamId, updatedResources } },
      update: (cache, { data: { updatePermissions } }) => {
        // Override __typename at this step because it comes in as `UpdatedTeamPayload`,
        // but the selectedTeam in the cache should always be type `Team`
        const updatedTeam = {
          ...updatePermissions,
          isDefault: null,
          __typename: 'Team',
        }

        cache.writeQuery({
          query: GET_SELECTED_TEAM,
          data: { selectedTeam: updatedTeam },
        })
      },
      onCompleted: afterSubmitHook,
    },
  )

  if (loading) return <Spinner />
  if (error) return 'Failed to save'

  return (
    <button
      onClick={updatePermissions}
      style={submitButtonStyle}
    >
      Save + Close
    </button>
  )
}


SubmitButton.propTypes = {
  nodeId: PropTypes.string,
  teamId: PropTypes.string,
  updatedResources: PropTypes.object,
  afterSubmitHook: PropTypes.func,
}

SubmitButton.defaultProps = {
  nodeId: null,
  teamId: null,
  updatedResources: {},
  afterSubmitHook: null,
}

export default SubmitButton
