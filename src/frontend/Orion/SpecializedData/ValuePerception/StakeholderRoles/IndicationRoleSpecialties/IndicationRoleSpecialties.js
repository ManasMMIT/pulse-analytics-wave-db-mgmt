import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'
import queryString from 'query-string'

import {
  GET_VEGA_PEOPLE_ROLES_INDICATIONS,
  GET_VEGA_PEOPLE_ROLES,
  GET_VEGA_INDICATIONS,
} from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Header from 'frontend/components/Header'
import StructuralListPanels from 'frontend/components/StructuralListPanels'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

import PanelHeader from './PanelHeader'
import PanelListItem from './PanelListItem'
import UpdateSpecialtyColumn from './UpdateSpecialtyColumn'
import CreateIndicationRoleSpecialtyForm from './CreateIndicationRoleSpecialtyForm'
import DeleteIndicationRoleSpecialtyForm from './DeleteIndicationRoleSpecialtyForm'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const TitleSection = styled.section({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: Spacing.S7,
  borderBottom: `2px solid ${Color.GRAY_LIGHT}`,
})

const Flex = styled.section({
  display: 'flex',
})

const panelHeight = 'calc(100vh - 76px)'
const listWrapperStyle = {
  minHeight: panelHeight,
  maxHeight: panelHeight,
  height: panelHeight,
}

const INDICATION = 'indication'
const ROLE = 'role'
const SPECIALTY = 'specialty'

const CREATE = 'create'
const DELETE = 'delete'

const IndicationRoleSpecialties = () => {
  const [modalType, setModalType] = useState(null)
  const location = useLocation()
  const history = useHistory()

  const { indication: indicationId, role: roleId, specialty: specialtyId } =
    (location.search && queryString.parse(location.search)) || {}

  const {
    data: indicationData,
    loading: indicationLoading,
    error: indicationError,
  } = useQuery(GET_VEGA_INDICATIONS)

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery(GET_VEGA_PEOPLE_ROLES)

  const {
    data: roleIndicationSpecialtiesData,
    loading: rolesIndicationSpecialtiesLoading,
    error: rolesIndicationSpecialtiesError,
  } = useQuery(GET_VEGA_PEOPLE_ROLES_INDICATIONS, {
    variables: { indicationId, roleId },
  })

  if (indicationLoading) return <Spinner />

  const handleListItemSearchUpdate = (nextParam) => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = {
      ...prevQueryParams,
      ...nextParam,
    }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  const indications = !indicationLoading
    ? _.sortBy(indicationData.vegaIndications, 'name')
    : []
  const roles = !rolesLoading ? _.sortBy(rolesData.vegaPeopleRoles, 'name') : []
  const roleIndicationSpecialties = !rolesIndicationSpecialtiesLoading
    ? _.sortBy(
        roleIndicationSpecialtiesData.vegaPeopleRolesIndications,
        'specialty_label'
      )
    : []

  const listConfigPanels = [
    {
      searchParamConfig: {
        searchParam: INDICATION,
        searchParamKey: 'id',
      },
      listWrapperStyle,
      listHeaderConfig: {
        title: 'Indication',
        ListHeader: PanelHeader,
      },
      listConfig: {
        ListItem: PanelListItem,
      },
      data: indications,
      loading: indicationLoading,
      error: indicationError,
    },
    {
      searchParamConfig: {
        searchParam: ROLE,
        searchParamKey: 'id',
      },
      listWrapperStyle,
      listHeaderConfig: {
        title: 'Roles',
        ListHeader: PanelHeader,
      },
      listConfig: {
        ListItem: PanelListItem,
      },
      data: roles,
      loading: rolesLoading,
      error: rolesError,
    },
    {
      searchParamConfig: {
        searchParam: SPECIALTY,
        searchParamKey: 'id',
      },
      listWrapperStyle,
      listHeaderConfig: {
        title: 'Specialties',
        ListHeader: (props) => (
          <PanelHeader
            {...props}
            shouldShowCreate
            handleCreate={() => setModalType(CREATE)}
          />
        ),
      },
      listConfig: {
        ListItem: (props) => (
          <PanelListItem
            {...props}
            shouldShowDelete
            labelKey="specialty_label"
            handleDelete={() => setModalType(DELETE)}
          />
        ),
      },
      data: roleIndicationSpecialties,
      loading: rolesIndicationSpecialtiesLoading,
      error: rolesIndicationSpecialtiesError,
    },
  ]

  let specialtyData = {}
  if (!rolesIndicationSpecialtiesLoading && specialtyId) {
    const specialty = roleIndicationSpecialtiesData.vegaPeopleRolesIndications.find(
      ({ id }) => id === specialtyId
    )
    if (specialty) {
      specialtyData = specialty
    }
  }

  let ModalComponent
  if (modalType) {
    ModalComponent =
      modalType === CREATE
        ? CreateIndicationRoleSpecialtyForm
        : DeleteIndicationRoleSpecialtyForm
  }

  return (
    <Container>
      <TitleSection>
        <Header
          header="Indication Role Specialties"
          subheader="Select a table row to view and edit an indication role specialty"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </TitleSection>
      <Flex>
        <Flex style={{ width: '66.66%' }}>
          <StructuralListPanels panels={listConfigPanels} />
        </Flex>
        <Flex style={{ width: '33.33%' }}>
          <UpdateSpecialtyColumn
            key={specialtyId}
            specialtyData={specialtyData}
          />
        </Flex>
      </Flex>
      {modalType && (
        <ModalComponent
          specialtyData={specialtyData}
          roleId={roleId}
          indicationId={indicationId}
          closeHandler={() => setModalType(null)}
          handleListItemSearchUpdate={handleListItemSearchUpdate}
        />
      )}
    </Container>
  )
}

export default IndicationRoleSpecialties
