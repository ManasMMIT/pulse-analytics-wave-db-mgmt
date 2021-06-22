import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_COMMUNITY_PRACTICE_NETWORKS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import EditCpnForm from './EditCpnForm'

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Name',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const MODAL_TO_COL_MAP = {
  name: {},
}

const CpnTable = () => {
  const [selectedRowId, setSelectedRowId] = useState(null)
  const { data, loading } = useQuery(GET_COMMUNITY_PRACTICE_NETWORKS)

  const onRowClick = ({ row }) => {
    const { original } = row
    setSelectedRowId(original.id)
  }
  const tableData = !loading ? data.vegaCommunityPracticeNetworks : []

  let selectedCpnData = {}
  if (selectedRowId) {
    const rowData = data.vegaCommunityPracticeNetworks.find(
      ({ id }) => id === selectedRowId
    )
    if (rowData) selectedCpnData = rowData
  }

  const closeHandler = () => {
    setSelectedRowId(null)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table
            width="auto"
            data={tableData}
            columns={COLUMNS}
            modalColMap={MODAL_TO_COL_MAP}
            onRowClickOverride={onRowClick}
            showExportButton={false}
          />
          {!_.isEmpty(selectedCpnData) && (
            <EditCpnForm
              selectedCpnData={selectedCpnData}
              closeHandler={closeHandler}
            />
          )}
        </>
      )}
    </>
  )
}

export default CpnTable
