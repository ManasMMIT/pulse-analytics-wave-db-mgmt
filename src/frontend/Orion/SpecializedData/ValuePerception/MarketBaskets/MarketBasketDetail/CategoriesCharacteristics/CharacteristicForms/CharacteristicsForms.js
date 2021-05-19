import React from 'react'
import PropTypes from 'prop-types'

import CreateCharacteristicForm from './CreateCharacteristicForm'
import DeleteCharacteristicForm from './DeleteCharacteristicForm'

const FORM_MAP = {
  create: CreateCharacteristicForm,
  delete: DeleteCharacteristicForm,
}
const CharacteristicForms = ({
  opType,
  closeHandler,
  characteristics,
  handleListItemSearchUpdate,
}) => {
  const Component = FORM_MAP[opType]
  return (
    <Component
      closeHandler={closeHandler}
      characteristics={characteristics}
      handleListItemSearchUpdate={handleListItemSearchUpdate}
    />
  )
}

CharacteristicForms.propTypes = {
  opType: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
}

export default CharacteristicForms
