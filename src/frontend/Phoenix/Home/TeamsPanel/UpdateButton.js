import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import {
  UPDATE_TEAM,
  MANAGE_UPDATED_TEAM,
} from '../../../api/mutations'

import TextFormButton from '../../shared/TextForm/Button'

const editIcon = (
  <FontAwesomeIcon
    size="lg"
    icon={faEdit}
  />
)

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
}

const UpdateButton = ({
  team: {
    _id,
    description,
  }
}) => (
  <TextFormButton
    modalTitle="Edit Team"
    buttonLabel={editIcon}
    buttonStyle={buttonStyle}
    data={{ description }}
    mutationDoc={UPDATE_TEAM}
    additionalFormData={{ _id }}
    clientMutation={MANAGE_UPDATED_TEAM}
  />
)

export default UpdateButton
