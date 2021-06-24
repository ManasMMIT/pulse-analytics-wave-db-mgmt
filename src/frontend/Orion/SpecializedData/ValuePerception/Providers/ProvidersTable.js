import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_VEGA_PROVIDERS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import EditProviderForm from './EditProviderForm'
import { PROVIDER_TYPE_MAP } from './utils'

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
  {
    Header: 'Type',
    accessor: 'type',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Institutions',
    accessor: 'institutions',
    /*
      ! This filter is not currently working as intended. We need to build a custom filterType
      ! for react-table that can generate filter options from array values.
    */
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => value.map(({ name }) => name).join(', '),
  },
  {
    Header: 'Community Practice Network',
    accessor: 'communityPracticeNetworkName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const MODAL_TO_COL_MAP = {
  type: {},
  institutions: {},
  communityPracticeNetworkName: {},
}

const ProvidersTable = () => {
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [providers, setProviders] = useState([])

  const { data, loading } = useQuery(GET_VEGA_PROVIDERS)

  useEffect(() => {
    if (!loading) {
      const tableData = data.vegaProviders.map(
        ({ id, name, type, institutions, community_practice_network }) => {
          const communityPracticeNetworkName = community_practice_network
            ? community_practice_network.name
            : null

          return {
            id,
            name,
            type: PROVIDER_TYPE_MAP[type],
            institutions,
            communityPracticeNetworkName,
          }
        }
      )

      setProviders(tableData)
    }
  }, [data, loading])

  const onRowClick = ({ row }) => {
    const { original } = row
    setSelectedRowId(original.id)
  }

  let selectedProviderData = {}
  if (selectedRowId) {
    const rowData = data.vegaProviders.find(({ id }) => id === selectedRowId)
    if (rowData) selectedProviderData = rowData
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
            data={providers}
            columns={COLUMNS}
            modalColMap={MODAL_TO_COL_MAP}
            onRowClickOverride={onRowClick}
            showExportButton={false}
          />
          {selectedRowId && (
            <EditProviderForm
              selectedProviderData={selectedProviderData}
              closeHandler={closeHandler}
            />
          )}
        </>
      )}
    </>
  )
}

export default ProvidersTable
