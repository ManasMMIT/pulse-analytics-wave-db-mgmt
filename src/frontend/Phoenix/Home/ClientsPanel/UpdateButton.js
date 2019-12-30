import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import { UPDATE_CLIENT } from '../../../api/mutations'

import { GET_CLIENTS } from '../../../api/queries'

import TextFormButton from '../../shared/TextForm/Button'

const editIcon = (
  <FontAwesomeIcon
    size="lg"
    icon={faEdit}
    style={{ color: 'white' }}
  />
)

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#0A2E4D',
  opacity: 0.3,
}

const UpdateButton = ({
  client: {
    _id,
    description,
  }
}) => (
  <TextFormButton
    modalTitle="Edit Client"
    buttonLabel={editIcon}
    buttonStyle={buttonStyle}
    data={{ description }}
    mutationDoc={UPDATE_CLIENT}
    additionalFormData={{ _id }}
    refetchQueries={[{ query: GET_CLIENTS }]}
  />
)

export default UpdateButton
