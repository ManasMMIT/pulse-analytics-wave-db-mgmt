import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_VEGA_PEOPLE_ROLES } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import EditRoleForm from './EditRoleForm'

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Role',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Type',
    accessor: 'typeName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Default Specialty Label',
    accessor: 'specialty',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const MODAL_TO_COL_MAP = {
  name: {},
  typeName: {},
  specialty: {},
}

const RolesTable = () => {
  const [selectedRowId, setSelectedRowId] = useState(null)

  const { data: rolesData, loading: rolesLoading } = useQuery(
    GET_VEGA_PEOPLE_ROLES
  )

  const onRowClick = ({ row }) => {
    const { original } = row
    setSelectedRowId(original.id)
  }

  let tableData
  if (!rolesLoading)
    tableData = rolesData.vegaPeopleRoles.map(
      ({ id, name, type, default_specialty_label }) => {
        let typeName
        if (type) {
          typeName = type.name
        }

        return {
          id,
          name,
          typeName,
          specialty: default_specialty_label,
        }
      }
    )

  const selectedRoleData = selectedRowId
    ? rolesData.vegaPeopleRoles.find(({ id }) => id === selectedRowId)
    : null

  return (
    <>
      {rolesLoading ? (
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
          {selectedRoleData && (
            <EditRoleForm
              selectedRoleData={selectedRoleData}
              closeHandler={() => setSelectedRowId(null)}
            />
          )}
        </>
      )}
    </>
  )
}

export default RolesTable
