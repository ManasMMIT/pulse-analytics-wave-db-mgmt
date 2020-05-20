import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import {
  UPDATE_TEAM,
  MANAGE_UPDATED_TEAM,
} from '../../../api/mutations'

import UpdateTeamButton from './TeamForm/Button'

import { Colors } from '../../../utils/pulseStyles'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  background: 'none',
  color: transparentize(0.7, Colors.BLACK),
  ':hover': {
    color: Colors.PRIMARY,
  },
})

const editIcon = (
  <EditIcon
    size="lg"
    icon={faEdit}
  />
)

const UpdateButton = ({ team }) => (
  <UpdateTeamButton
    modalTitle="Edit Team"
    buttonLabel={editIcon}
    buttonStyle={{ border: 'none', background: 'none' }}
    team={team}
    mutationDoc={UPDATE_TEAM}
    clientMutation={MANAGE_UPDATED_TEAM}
  />
)

export default UpdateButton
