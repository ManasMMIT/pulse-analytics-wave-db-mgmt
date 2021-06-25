import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_VEGA_PRODUCTS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import EditProductForm from './EditProductForm'

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Brand Name',
    accessor: 'brand_name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Generic Name',
    accessor: 'generic_name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Logo Link',
    accessor: 'logo_link',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Color',
    accessor: 'color',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Messaging',
    accessor: 'messaging',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const MODAL_TO_COL_MAP = {
  logo_link: {},
  color: {},
  messaging: {},
}

const ProductsTable = () => {
  const [selectedRowId, setSelectedRowId] = useState(null)

  const { data, loading } = useQuery(GET_VEGA_PRODUCTS)

  const onRowClick = ({ row }) => {
    const { original } = row
    setSelectedRowId(original.id)
  }

  let selectedProductData = {}
  if (selectedRowId) {
    const rowData = data.vegaProducts.find(({ id }) => id === selectedRowId)
    if (rowData) selectedProductData = rowData
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
            data={data.vegaProducts}
            columns={COLUMNS}
            modalColMap={MODAL_TO_COL_MAP}
            onRowClickOverride={onRowClick}
            showExportButton={false}
          />
          {!_.isEmpty(selectedProductData) && (
            <EditProductForm
              selectedProviderData={selectedProductData}
              closeHandler={closeHandler}
            />
          )}
        </>
      )}
    </>
  )
}

export default ProductsTable
