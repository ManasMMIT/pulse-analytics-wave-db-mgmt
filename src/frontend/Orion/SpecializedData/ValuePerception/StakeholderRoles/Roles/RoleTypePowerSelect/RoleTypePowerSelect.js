import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Select from 'react-select'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'

import Icon from 'frontend/components/Icon'
import { customSelectStyles } from 'frontend/components/customSelectStyles'

import Color from 'frontend/utils/color'

import CreateRoleTypeForm from './CreateRoleTypeForm'
import EditRoleTypeForm from './EditRoleTypeForm'

const COMPONENT_MAP = {
  create: CreateRoleTypeForm,
  update: EditRoleTypeForm,
}

const CreateOptionWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: Color.PRIMARY,
  cursor: 'pointer',
  justifyContent: 'space-between',
})

const CreateOption = ({ createOptionText }) => (
  <div>
    <CreateOptionWrapper>
      <div>{createOptionText}</div>
      <Icon iconName="add" color1={Color.PRIMARY} width={16} />
    </CreateOptionWrapper>
  </div>
)

const RoleTypePowerSelect = () => {
  const [modalData, setModalData] = useState(null)
  const [modalType, setModalType] = useState(null)

  const { data: rolesTypesData, loading: rolesTypesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES_TYPES
  )

  let typeData = []
  let options = []
  if (!rolesTypesLoading) {
    typeData = rolesTypesData.vegaPeopleRolesTypes
    options = typeData.map(({ id, name }) => ({
      label: name,
      value: id,
    }))

    options.unshift({
      label: <CreateOption createOptionText={'Create Role Type'} />,
      value: null,
    })
  }

  const ModalComponent = modalType ? COMPONENT_MAP[modalType] : null

  const closeHandler = () => {
    setModalType(null)
    setModalData(null)
  }

  const onChange = ({ label, value }) => {
    if (!value) {
      setModalType('create')
    } else {
      setModalData({ label, value })
      setModalType('update')
    }
  }

  return (
    <div style={{ minWidth: 200 }}>
      <Select
        placeholder={'Select Role Type'}
        value={modalData}
        options={options}
        styles={customSelectStyles}
        onChange={onChange}
        isDisabled={rolesTypesLoading}
      />
      {modalType && (
        <ModalComponent
          rolesTypesData={typeData}
          modalData={modalData}
          closeHandler={closeHandler}
        />
      )}
    </div>
  )
}

export default RoleTypePowerSelect
