import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_INSTITUTIONS } from 'frontend/api/queries'
import { CREATE_INSTITUTION } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
} from '../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const CreateInstitutionForm = ({ closeHandler }) => {
  const [institutionName, setInstitutionName] = useState('')

  const { data: institutionsData, loading: institutionsLoading } = useQuery(
    GET_INSTITUTIONS
  )

  const [createInstitution, { loading: mutationLoading }] = useMutation(
    CREATE_INSTITUTION,
    {
      variables: {
        input: {
          name: institutionName,
        },
      },
      update: (cache, { data: { createVegaInstitution } }) => {
        const newInstitutions = [
          ...institutionsData.vegaInstitutions,
          createVegaInstitution,
        ]
        cache.writeQuery({
          query: GET_INSTITUTIONS,
          data: { vegaInstitutions: newInstitutions },
        })
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

  const isLoading = mutationLoading || institutionsLoading

  return (
    <SingleActionDialog
      header={'Create Institution'}
      submitText="Create Institution"
      submitHandler={createInstitution}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {isLoading ? (
          <Spinner />
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
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateInstitutionForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
}

export default CreateInstitutionForm
