import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

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
  padding: Spacing.S7,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
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
  // {
  //   Header: 'Provider'
  // },
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
]

const MODAL_TO_COL_MAP = {
  stateName: {},
  roleName: {},
}

const Stakeholders = () => {
  const [modalData, setModalData] = useState(null)
  const { data, loading } = useQuery(GET_MARKET_BASKETS_SURVEYS_STAKEHOLDERS)

  const onRowClick = ({ row }) => {
    const { original } = row
    setModalData(original)
  }

  let tableData = []

  if (!loading) {
    data.marketBasketsSurveysStakeholders.forEach(
      ({ id, first_name, last_name, primary_state, role }) => {
        let stateName
        let stateId
        let roleName
        let roleId

        if (primary_state) {
          const { abbreviation, id } = primary_state
          stateName = abbreviation
          stateId = id
        }

        if (role) {
          const { name, id } = role
          roleName = name
          roleId = id
        }

        tableData.push({
          id,
          name: `${first_name} ${last_name}`,
          stateName,
          stateId,
          roleName,
          roleId,
        })
      }
    )
  }

  return (
    <Container>
      <Header
        header="Stakeholders"
        subheader="Select a table row to view and edit a Stakeholder's state or role"
        headerStyle={{ ...FontSpace.FS5 }}
      />
      {loading ? (
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
