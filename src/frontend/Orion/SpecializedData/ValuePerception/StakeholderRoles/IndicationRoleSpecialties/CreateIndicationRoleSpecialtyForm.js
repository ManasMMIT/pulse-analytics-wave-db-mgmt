import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_VEGA_PEOPLE_ROLES_INDICATIONS,
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_INDICATIONS,
} from 'frontend/api/queries'
import { CREATE_VEGA_PERSON_ROLE_INDICATION } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
  BlueText,
} from '../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const CreateIndicationRoleSpecialtyForm = ({
  closeHandler,
  indicationId,
  roleId,
  handleListItemSearchUpdate,
}) => {
  const [specialtyInput, setSpecialtyInput] = useState('')

  const { data: roleIndicationSpecialtiesData } = useQuery(
    GET_VEGA_PEOPLE_ROLES_INDICATIONS,
    {
      variables: { indicationId, roleId },
    }
  )

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const { data: indicationsData, loading: indicationsLoading } = useQuery(
    GET_VEGA_INDICATIONS
  )

  const handleListItemCreate = (createVegaPersonRoleIndication) => {
    if (!createVegaPersonRoleIndication.id) return null
    handleListItemSearchUpdate({
      specialty: createVegaPersonRoleIndication.id,
    })
  }

  const [createRoleSpecialty, { loading: mutationLoading }] = useMutation(
    CREATE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          specialty_label: specialtyInput,
          person_role_id: roleId,
          indication_id: indicationId,
        },
      },
      update: (cache, { data: { createVegaPersonRoleIndication } }) => {
        const newRoleSpecialties = [
          ...roleIndicationSpecialtiesData.vegaPeopleRolesIndications,
          createVegaPersonRoleIndication,
        ]

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
          data: { vegaPeopleRolesIndications: newRoleSpecialties },
          variables: { indicationId, roleId },
        })
      },
      onError: alert,
      onCompleted: ({ createVegaPersonRoleIndication }) => {
        closeHandler()
        handleListItemCreate(createVegaPersonRoleIndication)
      },
    }
  )

  const onTextChange = ({ value }) => {
    setSpecialtyInput(value)
  }

  const selectedRole = rolesData.vegaPeopleRoles.find(({ id }) => id === roleId)
  const selectedIndication = indicationsData.vegaIndications.find(
    ({ id }) => id === indicationId
  )
  const role = selectedRole.name
  const indication = selectedIndication.name

  const isLoading = mutationLoading || rolesLoading || indicationsLoading

  const header = (
    <p>
      Create <BlueText>{indication}</BlueText> - <BlueText>{role}</BlueText>{' '}
      Specialty
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Create Indication Role Specialty"
      submitHandler={createRoleSpecialty}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>Specialty Label (required)</FormLabel>
                <Input
                  name="specialty_label"
                  type="text"
                  value={specialtyInput}
                  onChange={onTextChange}
                />
              </InputSection>
              <InputSection>
                <FormLabel>Role</FormLabel>
                <Select value={{ label: role, value: role }} isDisabled />
              </InputSection>
              <InputSection>
                <FormLabel>Indication</FormLabel>
                <Select
                  value={{ label: indication, value: indication }}
                  isDisabled
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

CreateIndicationRoleSpecialtyForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  indicationId: PropTypes.string.isRequired,
  roleId: PropTypes.string.isRequired,
}

export default CreateIndicationRoleSpecialtyForm
