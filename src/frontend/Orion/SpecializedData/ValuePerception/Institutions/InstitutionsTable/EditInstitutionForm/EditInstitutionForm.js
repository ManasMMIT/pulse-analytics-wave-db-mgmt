import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { UPDATE_INSTITUTION } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import DeleteInstitutionSection from './DeleteInstitutionSection'
import {
  InputSection,
  FormLabel,
  BlueText,
} from '../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const EditInstitutionForm = ({ selectedInstitutionData, closeHandler }) => {
  const { id, name } = selectedInstitutionData
  const [institutionName, setInstitutionName] = useState(name)

  const [updateInstitution, { loading: mutationLoading }] = useMutation(
    UPDATE_INSTITUTION,
    {
      variables: {
        input: {
          id,
          name: institutionName,
        },
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const onTextChange = ({ value }) => {
    setInstitutionName(value)
  }

  const header = (
    <p>
      Edit <BlueText>{name}</BlueText> Institution
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Edit Institution"
      submitHandler={updateInstitution}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {mutationLoading ? (
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
                  value={institutionName}
                  onChange={onTextChange}
                />
              </InputSection>
            </form>
            <DeleteInstitutionSection
              institutionId={id}
              name={name}
              closeHandler={closeHandler}
            />
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditInstitutionForm.propTypes = {
  selectedInstitutionData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default EditInstitutionForm
