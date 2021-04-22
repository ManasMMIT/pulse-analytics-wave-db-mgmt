import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import Button from 'frontend/components/Button'
import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import Header from 'frontend/components/Header'
import ExportExcelButton from 'frontend/components/ExportExcelButton'
import Icon from 'frontend/components/Icon'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import formatDataForExport from 'frontend/components/ExportExcelButton/formatDataForExport'

import _ from 'lodash'
import MarketBasketForm from '../MarketBasketForm'
import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

const COLUMNS = [
  {
    Header: 'Market Basket',
    accessor: 'name',
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
      <Link
        to={`/orion/specialized/value-perception/sandbox-market-baskets/${id}`}
      >
        {value}
      </Link>
    ),
  },
  {
    Header: 'Last Survey Date',
    accessor: 'placeholderSurveyDate',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: '# Surveys',
    accessor: 'placeholderSurveyLen',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Indication',
    accessor: ({ indication }) => indication.name,
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Products',
    accessor: 'products_regimens',
    /*
      ! This filter is not currently working as intended. We need to build a custom filterType
      ! for react-table that can generate filter options from array values.
    */
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) =>
      _.uniq(value.map(({ product: { generic_name } }) => generic_name)).join(
        ', '
      ),
  },
  {
    Header: '# Stakeholders (last survey)',
    accessor: 'placeholderLastSurveyStakeholder',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Active Client Subscriptions',
    accessor: 'team_subscriptions',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => {
      const teamClientNames = value.map(
        ({
          team: {
            client: { name: clientName },
          },
        }) => clientName
      )

      return _.uniq(teamClientNames)
        .sort((a, b) => a.toLowerCase() - b.toLowerCase())
        .join(', ')
    },
  },
]

const HeaderWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S7,
})

const MarketBasketList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, loading } = useQuery(GET_MARKET_BASKETS)

  const tableData = loading ? [] : data.marketBaskets

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
  const dataFormattedForExport = formatDataForExport({
    data: tableData,
    columns: COLUMNS,
    cellsToFormat: ['products_regimens', 'team_subscriptions'],
  })

  return (
    <div>
      <HeaderWrapper>
        <Header
          header="Market Baskets"
          subheader="Select a table row to view and edit Market Basket details and survey data"
          headerStyle={{ ...FontSpace.FS5 }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <Button onClick={() => setIsModalOpen(true)}>
              + Create Market Basket
            </Button>
          </div>
          <div style={{ marginLeft: 24 }}>
            <ExportExcelButton
              data={dataFormattedForExport}
              filename="market-basket-list"
              buttonStyle={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon
                iconName="export"
                color1={Color.PRIMARY}
                width={12}
                height={12}
                style={{ marginRight: 8 }}
              />
              Export
            </ExportExcelButton>
          </div>
        </div>
      </HeaderWrapper>
      {isModalOpen && (
        <MarketBasketForm
          onCompleted={() => setIsModalOpen(false)}
          cancelHandler={() => setIsModalOpen(false)}
        />
      )}
      {table}
    </div>
  )
}

export default MarketBasketList
