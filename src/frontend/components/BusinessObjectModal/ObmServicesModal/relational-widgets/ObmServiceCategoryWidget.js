// TODO: Remove this widget by adding one-to-one relational field as BOM input
// * The field service.category exists and should be used w/
// * a dropdown in the regular bom profile section

import React, { useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_OBM_SERVICES_CATEGORIES,
  GET_OBM_SERVICES,
  GET_VIEW_OBM_SERVICES,
} from '../../../../api/queries'

import { UPDATE_OBM_SERVICE } from '../../../../api/mutations'

const ObmServiceCategoryWidget = ({ entity }) => {
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_OBM_SERVICES_CATEGORIES
  )

  const [selectedCategoryId, selectCategoryId] = useState(entity.category_id)

  const [save] = useMutation(UPDATE_OBM_SERVICE, {
    variables: {
      input: {
        id: entity.id,
        category_id: selectedCategoryId,
      },
    },
    refetchQueries: [
      { query: GET_OBM_SERVICES },
      { query: GET_VIEW_OBM_SERVICES },
    ],
    onError: alert,
  })

  if (categoriesLoading) return 'Loading...'

  const options = categoriesData.obmServicesCategories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  return (
    <div style={{ padding: 24, width: 500, height: '100%' }}>
      <Select
        options={options}
        value={options.find(({ value }) => value === selectedCategoryId)}
        onChange={({ value }) => selectCategoryId(value)}
      />

      <button
        style={{
          border: '1px solid black',
          cursor: 'pointer',
          padding: 4,
          marginTop: 12,
        }}
        onClick={save}
      >
        Save
      </button>
    </div>
  )
}

export default ObmServiceCategoryWidget
