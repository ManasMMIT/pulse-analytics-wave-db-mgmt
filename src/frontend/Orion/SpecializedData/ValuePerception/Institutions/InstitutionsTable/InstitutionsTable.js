import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_INSTITUTIONS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import EditInstitutionForm from './EditInstitutionForm'

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

const InstitutionsTable = () => {
  const [selectedRowId, setSelectedRowId] = useState(null)
  const { data, loading } = useQuery(GET_INSTITUTIONS)

  const onRowClick = ({ row }) => {
    const { original } = row
    setSelectedRowId(original.id)
  }
  const tableData = !loading ? data.vegaInstitutions : []

  let selectedInstitutionData = {}
  if (selectedRowId) {
    const rowData = data.vegaInstitutions.find(({ id }) => id === selectedRowId)
    if (rowData) selectedInstitutionData = rowData
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
          {selectedRowId && (
            <EditInstitutionForm
              selectedInstitutionData={selectedInstitutionData}
              closeHandler={closeHandler}
            />
          )}
        </>
      )}
    </>
  )
}

export default InstitutionsTable
