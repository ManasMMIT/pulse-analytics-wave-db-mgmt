import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE_TYPE } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
} from '../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const CreateRoleTypeForm = ({ rolesTypesData, closeHandler }) => {
  const [roleTypeName, setRoleTypeName] = useState('')

  const [createRoleType, { loading: mutationLoading }] = useMutation(
    CREATE_VEGA_PERSON_ROLE_TYPE,
    {
      variables: { input: { name: roleTypeName } },
      update: (cache, { data: { createVegaPersonRoleType } }) => {
        const newRolesTypes = [...rolesTypesData, createVegaPersonRoleType]

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_TYPES,
          data: { vegaPeopleRolesTypes: newRolesTypes },
        })
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const onChange = ({ value }) => {
    setRoleTypeName(value)
  }

  return (
    <SingleActionDialog
      header={'Create Role Type'}
      submitText="Create Type"
      submitHandler={createRoleType}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {mutationLoading ? (
          <Spinner />
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
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateRoleTypeForm.propTypes = {
  rolesTypesData: PropTypes.array.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default CreateRoleTypeForm
