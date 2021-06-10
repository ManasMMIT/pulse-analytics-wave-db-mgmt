import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { UPDATE_VEGA_PERSON_ROLE_TYPE } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import DeleteRoleTypeSection from './DeleteRoleTypeSection'
import {
  InputSection,
  FormLabel,
  BlueText,
} from '../../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const EditRoleTypeForm = ({ modalData, closeHandler }) => {
  const { value, label } = modalData
  const [roleTypeName, setRoleTypeName] = useState(label)

  const onChange = ({ value }) => {
    setRoleTypeName(value)
  }

  const [updateRoleType, { loading }] = useMutation(
    UPDATE_VEGA_PERSON_ROLE_TYPE,
    {
      variables: {
        input: {
          id: value,
          name: roleTypeName,
        },
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const header = (
    <p>
      Edit <BlueText>{label}</BlueText> Role Type
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Edit Type"
      submitHandler={updateRoleType}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {loading ? (
          <div style={{ height: 236, textAlign: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>Name (required)</FormLabel>
                <Input
                  name="name"
                  type="text"
                  value={roleTypeName}
                  onChange={onChange}
                />
              </InputSection>
            </form>
            <DeleteRoleTypeSection
              id={value}
              name={label}
              closeHandler={closeHandler}
            />
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditRoleTypeForm.propTypes = {
  modalData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default EditRoleTypeForm
