import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'

import { GET_VEGA_PEOPLE_ROLES, GET_VEGA_STATES } from 'frontend/api/queries'
import { UPDATE_VEGA_PERSON } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
  BlueText,
} from '../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const getHeaderTitle = (name) => (
  <p>
    Edit <BlueText>{name}</BlueText> Stakeholder
  </p>
)

const EditStakeholderForm = ({ stakeholder, closeModal }) => {
  const { id, name, stateId, roleId, stateName, roleName } = stakeholder
  const [personData, setPersonData] = useState({
    id,
    stateId,
    stateName,
    roleId,
    roleName,
  })

  const { data: statesData, loading: statesLoading } = useQuery(GET_VEGA_STATES)
  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const [updatePerson, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PERSON,
    {
      onError: alert,
      onCompleted: () => {
        closeModal()
      },
    }
  )

  const handleChange = ({ label, value, isState = false }) => {
    const idKey = isState ? 'stateId' : 'roleId'
    const nameKey = isState ? 'stateName' : 'roleName'

    setPersonData({ ...personData, [idKey]: value, [nameKey]: label })
  }

  const updatePersonHandler = () => {
    const input = {
      id: stakeholder.id,
      primary_state_id: personData.stateId,
      role_id: personData.roleId,
    }

    updatePerson({ variables: { input } })
  }

  const selectedStateOption = {
    label: personData.stateName || 'Select State..',
    value: personData.stateId,
  }
  let selectedStateOptions = []
  if (!statesLoading) {
    const stateOptions = statesData.vegaStates.map(({ id, abbreviation }) => ({
      label: abbreviation,
      value: id,
    }))
    selectedStateOptions = _.sortBy(stateOptions, 'label')
  }

  const selectedRoleOption = {
    label: personData.roleName || 'Select Role..',
    value: personData.roleId,
  }
  let selectedRoleOptions = []
  if (!rolesLoading) {
    const roleOptions = rolesData.vegaPeopleRoles.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
    selectedRoleOptions = _.sortBy(roleOptions, 'label')
  }

  const dialogHeader = getHeaderTitle(name)
  const isLoading = mutationLoading || statesLoading || rolesLoading

  return (
    <SingleActionDialog
      header={dialogHeader}
      submitText="Edit Stakeholder"
      submitHandler={updatePersonHandler}
      cancelHandler={closeModal}
    >
      <div style={{ padding: `${Spacing.S4} ${Spacing.S7} ${Spacing.S7}` }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>State</FormLabel>
                <Select
                  value={selectedStateOption}
                  options={selectedStateOptions}
                  onChange={(props) =>
                    handleChange({ ...props, isState: true })
                  }
                />
              </InputSection>
              <InputSection>
                <FormLabel>Role</FormLabel>
                <Select
                  value={selectedRoleOption}
                  options={selectedRoleOptions}
                  onChange={handleChange}
                />
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditStakeholderForm.propTypes = {
  stakeholder: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default EditStakeholderForm
