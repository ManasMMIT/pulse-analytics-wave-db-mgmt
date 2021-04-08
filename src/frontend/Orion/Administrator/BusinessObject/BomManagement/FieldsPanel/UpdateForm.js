import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Form from './Form'

const UpdateForm = ({
  data,
  mutationDoc,
  mutationVars,
  afterMutationHook,
  selectedBom,
}) => {
  if (_.isEmpty(data)) return null

  return (
    <Form
      data={data}
      selectedBom={selectedBom}
      mutationDoc={mutationDoc}
      mutationVars={mutationVars}
      afterMutationHook={afterMutationHook}
    />
  )
}

UpdateForm.propTypes = {
  ...Form.propTypes,
  modalTitle: PropTypes.string,
  modalStyle: PropTypes.object,
}

UpdateForm.defaultProps = {
  ...Form.defaultProps,
  modalTitle: null,
  modalStyle: {},
}

export default UpdateForm
