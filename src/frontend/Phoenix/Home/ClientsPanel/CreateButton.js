import React from 'react'

import TextFormButton from '../../shared/TextForm/Button'

import {
  CREATE_CLIENT,
  MANAGE_CREATED_CLIENT,
} from '../../../api/mutations'

const CREATE_BUTTON_TXT = 'Create Client'

const CREATE_MODAL_TITLE = 'Create New Client'

const createButtonStyle = {
  background: "#234768",
  color: 'white',
}

const CreateButton = () => (
  <TextFormButton
    modalTitle={CREATE_MODAL_TITLE}
    buttonLabel={CREATE_BUTTON_TXT}
    buttonStyle={createButtonStyle}
    mutationDoc={CREATE_CLIENT}
    clientMutation={MANAGE_CREATED_CLIENT}
  />
)

export default CreateButton
