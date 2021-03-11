import React from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { transparentize } from 'polished'

import { GET_SELECTED_TEAM } from '../../../../../../../api/queries'
import { UPDATE_PERMISSIONS } from '../../../../../../../api/mutations/teams'
import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing } from '../../../../../../../utils/pulseStyles'

const StyledSubmitButton = styled.button({
  background: transparentize(0.85, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  color: Colors.PRIMARY,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  ':hover': {
    background: transparentize(0.7, Colors.PRIMARY),
  },
  ':active': {
    outline: 'none'
  },
  ':focus': {
    outline: 'none'
  }
})

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

  if (loading) return (
    <div
      style={{
        diplay: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
      <span
        style={{
          color: Colors.PRIMARY,
          fontSize: 9,
          fontWeight: 700,
          paddingLeft: 12,
        }}
      >
        SAVING
      </span>
    </div>
  )
  if (error) return 'Failed to save'

  return (
    <StyledSubmitButton
      onClick={updatePermissions}
    >
      Save + Close
    </StyledSubmitButton>
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
