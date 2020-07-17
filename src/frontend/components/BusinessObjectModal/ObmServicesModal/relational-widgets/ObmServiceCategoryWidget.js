import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_OBM_SERVICES_CATEGORIES,
  GET_JOIN_OBMS_SERVICES_AND_OBMS_SERVICES_CATEGORIES,
  GET_VIEW_OBM_SERVICES,
} from '../../../../api/queries'

import { CONNECT_OBM_SERVICE_AND_OBM_SERVICE_CATEGORY } from '../../../../api/mutations'

const ObmServiceCategoryWidget = ({ entity }) => {
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_OBM_SERVICES_CATEGORIES
  )

  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_JOIN_OBMS_SERVICES_AND_OBMS_SERVICES_CATEGORIES,
    {
      variables: { obmServiceId: entity._id },
    }
  )

  const [selectedCategoryId, selectCategoryId] = useState(null)

  const connections = Object.values(connectionsData || {})[0]

  const connectionId = connections && connections[0] && connections[0]._id

  const [save] = useMutation(CONNECT_OBM_SERVICE_AND_OBM_SERVICE_CATEGORY, {
    variables: {
      input: {
        _id: connectionId,
        obmServiceId: entity._id,
        obmServiceCategoryId: selectedCategoryId,
        // obmServiceId: { _id: entity._id, boId: '5ed81e5fb8ebf33703463750' },
        // obmServiceCategoryId: { _id: selectedCategoryId, boId: '5ed81ed8bcfdf6381562c17e' },
      },
    },
    refetchQueries: [
      {
        query: GET_JOIN_OBMS_SERVICES_AND_OBMS_SERVICES_CATEGORIES,
        variables: { obmServiceId: entity._id },
      },
      {
        query: GET_VIEW_OBM_SERVICES,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!categoriesLoading && !connectionsLoading) {
      if (connections && connections[0]) {
        // ! HOTFIX: make sure there are no connections in the cache for removed categories
        const categoriesById = _.keyBy(Object.values(categoriesData)[0], '_id')
        const validConnections = connections.filter(
          (connection) => categoriesById[connection.obmServiceCategoryId]
        )

        const initialCategoryId = validConnections.length
          ? validConnections[0].obmServiceCategoryId
          : null

        selectCategoryId(initialCategoryId)
      }
    }
  }, [categoriesLoading, connectionsLoading])

  if (categoriesLoading || connectionsLoading) return 'Loading...'

  const options = categoriesData.obmServicesCategories.map(({ _id, name }) => ({
    value: _id,
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
