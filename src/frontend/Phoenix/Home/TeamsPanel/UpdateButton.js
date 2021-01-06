import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { UPDATE_TEAM, MANAGE_UPDATED_TEAM } from '../../../api/mutations'

import UpdateTeamButton from './TeamForm/Button'

import Color from 'frontend/utils/color'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  color: transparentize(0.7, Color.BLACK),
  ':hover': {
    color: Color.PRIMARY,
    background: transparentize(0.85, Color.PRIMARY),
  },
  ':active': {
    background: transparentize(0.85, Color.PRIMARY),
  },
})

const editIcon = <EditIcon size="lg" icon={faEdit} />

const UpdateButton = ({ team }) => (
  <UpdateTeamButton
    modalTitle="Edit Team"
    buttonLabel={editIcon}
    buttonStyle={{ border: 'none' }}
    team={team}
    mutationDoc={UPDATE_TEAM}
    clientMutation={MANAGE_UPDATED_TEAM}
  />
)

export default UpdateButton
