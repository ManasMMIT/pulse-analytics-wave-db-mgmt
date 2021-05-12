import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import Caption from 'frontend/components/Caption'
import Button from 'frontend/components/Button'
import ExportExcelButton from 'frontend/components/ExportExcelButton'
import Icon from 'frontend/components/Icon'
import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'

import formatDataForExport from 'frontend/components/ExportExcelButton/formatDataForExport'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'

import AddProductForm from './AddProductForm'
import EditProductForm from './EditProductForm'

import Color from 'frontend/utils/color'

const Wrapper = styled.div({
  height: '100%',
  background: Color.WHITE,
})

const TableHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 24px',
})

const generateColumns = (setActiveModal) => [
  {
    Header: 'Product',
    accessor: ({ product }) => product.generic_name,
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 200,
    Cell: ({
      value,
      row: {
        original: { product },
      },
    }) => (
      <div
        onClick={() => setActiveModal({ type: 'edit', product })}
        style={{ cursor: 'pointer' }}
      >
        {value}
      </div>
    ),
  },
  {
    Header: 'Manufacturers',
    accessor: 'manufacturers',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'textArray',
    Cell: ({ value }) => value.join(', '),
    width: 300,
  },
  {
    Header: 'Regimens',
    accessor: 'regimens',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'textArray',
    width: 300,
    Cell: ({ value }) => value.map(({ name }) => name).join(', '),
  },
]

const getTableData = (products_regimens) => {
  const groupedProdRegCombos = _.groupBy(
    products_regimens,
    'product.generic_name'
  )

  const tableData = Object.entries(groupedProdRegCombos).reduce(
    (acc, [__, regimenCombos]) => {
      const { product } = regimenCombos[0]
      const regimens = regimenCombos.map(({ regimen }) => regimen)

      const manufacturers = _.uniq(
        regimenCombos.map(({ product: { manufacturers } }) =>
          manufacturers.map(({ name }) => name).join(',')
        )
      )

      const nestedComboObj = {
        product,
        regimens,
        manufacturers,
      }

      return [...acc, nestedComboObj]
    },
    []
  )
  return tableData
}

const MODAL_MAP = {
  add: AddProductForm,
  edit: EditProductForm,
}

const ProductsRegimens = () => {
  const [activeModal, setActiveModal] = useState(null)

  const { marketBasketId } = useParams()
  const { data, loading } = useQuery(GET_MARKET_BASKETS)

  if (loading) return <Spinner />

  const marketBasket = data.marketBaskets.find(
    ({ id }) => id === marketBasketId
  )

  const { products_regimens } = marketBasket || { products_regimens: [] }

  const columns = generateColumns(setActiveModal)
  const tableData = getTableData(products_regimens)

  const dataFormattedForExport = formatDataForExport({
    data: tableData,
    columns,
    cellsToFormat: ['manufacturers', 'regimens'],
  })

  const ModalComponent = activeModal && MODAL_MAP[activeModal.type]

  const closeModal = () => setActiveModal(null)

  return (
    <Wrapper>
      <TableHeader>
        <Caption>Click Product Row to edit regimens or delete product</Caption>
        <div>
          <Button
            onClick={() => setActiveModal({ type: 'add' })}
            buttonStyle={{ marginRight: 24 }}
          >
            + Add Product
          </Button>
          <ExportExcelButton
            data={dataFormattedForExport}
            filename="market-basket-products-regimens"
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
      </TableHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={tableData}
        columns={columns}
        showExportButton={false}
        wrapperStyle={{ height: 'calc(100% - 55px)' }}
      />
      {activeModal && (
        <ModalComponent
          marketBasket={marketBasket}
          product={activeModal && activeModal.product}
          onCompleted={closeModal}
          cancelHandler={closeModal}
        />
      )}
    </Wrapper>
  )
}

export default ProductsRegimens
