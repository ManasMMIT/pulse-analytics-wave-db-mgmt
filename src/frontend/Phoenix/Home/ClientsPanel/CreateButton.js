import React from 'react'

import TextFormButton from '../../shared/TextForm/Button'

import { Colors } from '../../../utils/pulseStyles'

import {
  CREATE_CLIENT,
  MANAGE_CREATED_CLIENT,
} from '../../../api/mutations'

const CREATE_BUTTON_TXT = 'Create Client'

const CREATE_MODAL_TITLE = 'Create New Client'

const CreateButton = () => (
  <TextFormButton
    modalTitle={CREATE_MODAL_TITLE}
    buttonLabel={CREATE_BUTTON_TXT}
    buttonColor={Colors.WHITE}
    mutationDoc={CREATE_CLIENT}
    clientMutation={MANAGE_CREATED_CLIENT}
  />
)

export default CreateButton
