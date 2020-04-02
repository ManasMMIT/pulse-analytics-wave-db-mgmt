import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import UserFormButton from './UserForm/Button'

import {
  UPDATE_USER,
  MANAGE_UPDATED_USER,
} from '../../../api/mutations'

import { Colors } from '../../../utils/pulseStyles'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  background: 'none',
  color: transparentize(0.7, Colors.BLACK),
  margin: '0 8px',
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

const UpdateButton = ({ userData }) => (
  <UserFormButton
    userData={userData}
    modalTitle="Edit User"
    buttonLabel={editIcon}
    buttonStyle={{ border: 'none', background: 'none' }}
    mutationDoc={UPDATE_USER}
    clientMutation={MANAGE_UPDATED_USER}
  />
)

export default UpdateButton
