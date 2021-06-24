import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import { GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS } from 'frontend/api/queries'

import Header from 'frontend/components/Header'
import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import EditStakeholderForm from './EditStakeholderForm'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const TitleSection = styled.section({
  display: 'flex',
  padding: Spacing.S7,
  alignItems: 'center',
})

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Stakeholder',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Provider',
    accessor: 'providerName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'State',
    accessor: 'stateName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Stakeholder Role',
    accessor: 'roleName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Specialty Roles',
    accessor: 'roleSpecialties',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) =>
      value.map(({ specialty_label }) => specialty_label).join(', '),
  },
]

const MODAL_TO_COL_MAP = {
  stateName: {},
  providerName: {},
  roleName: {},
  roleSpecialties: {},
}

const Stakeholders = () => {
  const [modalData, setModalData] = useState(null)
  const { data: stakeholdersData, loading: stakeholderLoading } = useQuery(
    GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS
  )

  const onRowClick = ({ row }) => {
    const { original } = row
    setModalData(original)
  }

  let tableData = []
  if (!stakeholderLoading) {
    stakeholdersData.marketBasketsSurveysStakeholders.forEach(
      ({
        id,
        first_name,
        last_name,
        primary_state,
        role,
        perception_tool_provider,
        role_specialties,
      }) => {
        // * insert state data if applicable
        const stateName = primary_state ? primary_state.abbreviation : null
        const stateId = primary_state ? primary_state.id : null

        // * insert provider data if applicable
        const providerName = perception_tool_provider
          ? perception_tool_provider.name
          : null
        const providerId = perception_tool_provider
          ? perception_tool_provider.id
          : null

        // * insert role data if applicable
        const roleName = role ? role.name : null
        const roleId = role ? role.id : null

        const roleSpecialties = _.isEmpty(role_specialties)
          ? []
          : role_specialties

        tableData.push({
          id,
          name: `${first_name} ${last_name}`,
          stateName,
          stateId,
          roleName,
          roleId,
          providerName,
          providerId,
          roleSpecialties,
        })
      }
    )
  }

  return (
    <Container>
      <TitleSection>
        <Header
          header="Stakeholders"
          subheader="Select a table row to view and edit a Stakeholder's state or role"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </TitleSection>
      {stakeholderLoading ? (
        <Spinner />
      ) : (
        <Table
          width="auto"
          data={tableData}
          columns={COLUMNS}
          modalColMap={MODAL_TO_COL_MAP}
          onRowClickOverride={onRowClick}
          showExportButton={false}
        />
      )}
      {modalData && (
        <EditStakeholderForm
          stakeholder={modalData}
          closeModal={() => setModalData(null)}
        />
      )}
    </Container>
  )
}

export default Stakeholders
