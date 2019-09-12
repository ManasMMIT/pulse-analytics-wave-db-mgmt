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

const UpdateButton = ({ user }) => (
  <UserFormButton
    user={user}
    modalTitle="Edit User"
    buttonLabel={editIcon}
    buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
    mutationDoc={UPDATE_USER}
    clientMutation={MANAGE_UPDATED_USER}
  />
)

export default UpdateButton
