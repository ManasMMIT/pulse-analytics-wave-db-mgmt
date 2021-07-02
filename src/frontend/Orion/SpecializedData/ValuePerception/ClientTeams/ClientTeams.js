import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { GET_VEGA_CLIENT_TEAMS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import Header from 'frontend/components/Header'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const COLUMNS = [
  {
    Header: 'Client',
    accessor: 'client.name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    Cell: ({
      value,
      row: {
        original: { id },
      },
    }) => (
      <Link to={`/orion/specialized/value-perception/client-teams/${id}`}>
        {value}
      </Link>
    ),
  },
  {
    Header: 'Team (From Phoenix)',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const HeaderWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S7,
})

const ClientTeams = () => {
  const { data, loading } = useQuery(GET_VEGA_CLIENT_TEAMS)

  const tableData = loading ? [] : data.vegaClientTeams

  const table = loading ? (
    <>
      <Spinner />
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={tableData}
        columns={COLUMNS}
        showExportButton={false}
      />
    </>
  ) : (
    <Table
      width={CONFIG_TABLE_WIDTH}
      data={tableData}
      columns={COLUMNS}
      showExportButton={false}
    />
  )

  return (
    <div>
      <HeaderWrapper>
        <Header
          header="Client Teams"
          subheader="Select a table row to view and edit Client Team subscriptions and regions"
          headerStyle={{ ...FontSpace.FS5 }}
        />
      </HeaderWrapper>
      {table}
    </div>
  )
}

export default ClientTeams
