import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '@apollo/react-hooks'
import Select from 'react-select'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'
import { UPDATE_VEGA_PERSON_ROLE } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import DeleteRoleSection from './DeleteRoleSection'
import {
  InputSection,
  FormLabel,
  BlueText,
} from '../../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const EditRoleForm = ({ selectedRoleData, closeHandler }) => {
  const { id, name, type, default_specialty_label } = selectedRoleData
  let typeDefaultObj = type
    ? { label: type.name, value: type.id }
    : { label: null, value: null }

  const [inputData, setInputData] = useState({
    id,
    name,
    specialty: default_specialty_label,
    type: typeDefaultObj,
  })

  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  const [updateRole, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PERSON_ROLE,
    {
      variables: {
        input: {
          id,
          name: inputData.name,
          default_specialty_label: inputData.specialty,
          type_id: inputData.type.value,
        },
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
    roleTypeOptions = rolesTypesData.vegaPeopleRolesTypes.map(
      ({ id, name }) => ({
        label: name,
        value: id,
      })
    )
  }

  const header = (
    <p>
      Edit <BlueText>{name}</BlueText> Role
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Edit Role"
      submitHandler={updateRole}
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
            <DeleteRoleSection
              roleId={id}
              name={name}
              closeHandler={closeHandler}
            />
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditRoleForm.propTypes = {
  selectedRoleData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default EditRoleForm
