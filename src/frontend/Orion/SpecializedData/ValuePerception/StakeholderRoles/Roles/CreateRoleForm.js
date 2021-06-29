import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_PEOPLE_ROLES_TYPES,
} from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
} from '../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const NO_TYPE_OPTION = {
  label: 'No Type',
  value: null,
}

const CreateRoleForm = ({ closeHandler }) => {
  const [inputData, setInputData] = useState({
    name: '',
    specialty: '',
    type: NO_TYPE_OPTION,
  })

  const { data: rolesData } = useQuery(GET_VEGA_PEOPLE_ROLES)
  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  const [createRole, { loading: mutationLoading }] = useMutation(
    CREATE_VEGA_PERSON_ROLE,
    {
      variables: {
        input: {
          name: inputData.name,
          default_specialty_label: inputData.specialty,
          type_id: inputData.type.value,
        },
      },
      update: (cache, { data: { createVegaPersonRole } }) => {
        const newRoles = [...rolesData.vegaPeopleRoles, createVegaPersonRole]

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES,
          data: { vegaPeopleRoles: newRoles },
        })
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const onTextChange = ({ name, value }) => {
    setInputData({ ...inputData, [name]: value })
  }

  const onSelectChange = ({ label, value }) => {
    setInputData({ ...inputData, type: { value, label } })
  }

  let roleTypeOptions = []
  if (!rolesTypesLoading) {
    roleTypeOptions = [
      NO_TYPE_OPTION,
      ...rolesTypesData.vegaPeopleRolesTypes.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    ]
  }

  return (
    <SingleActionDialog
      header={'Create Role'}
      submitText="Create Role"
      submitHandler={createRole}
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
                  value={inputData.name}
                  onChange={onTextChange}
                />
              </InputSection>
              <InputSection>
                <FormLabel>Default Specialty Label</FormLabel>
                <Input
                  name="specialty"
                  type="text"
                  value={inputData.specialty}
                  onChange={onTextChange}
                />
              </InputSection>
              <InputSection>
                <FormLabel>Role Type</FormLabel>
                <Select
                  placeholder={'Select Role Type'}
                  value={inputData.type}
                  options={roleTypeOptions}
                  onChange={onSelectChange}
                  isDisabled={rolesTypesLoading}
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateRoleForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
}

export default CreateRoleForm
