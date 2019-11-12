import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import UserFormButton from './UserForm/Button'

import {
  UPDATE_USER,
  MANAGE_UPDATED_USER,
} from '../../../api/mutations'

const editIcon = (
  <FontAwesomeIcon
    size="lg"
    icon={faEdit}
  />
)

const UpdateButton = ({ userData }) => (
  <UserFormButton
    userData={userData}
    modalTitle="Edit User"
    buttonLabel={editIcon}
    buttonStyle={{ border: 'none', background: 'none', color: '#0A2E4D', opacity: 0.3 }}
    mutationDoc={UPDATE_USER}
    clientMutation={MANAGE_UPDATED_USER}
  />
)

export default UpdateButton
