import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'

import {
  GET_LBM_SERVICES_CATEGORIES,
  GET_JOIN_LBMS_SERVICES_AND_LBMS_SERVICES_CATEGORIES,
  GET_VIEW_LBM_SERVICES,
} from 'frontend/api/queries'

import { CONNECT_LBM_SERVICE_AND_LBM_SERVICE_CATEGORY } from 'frontend/api/mutations'

interface LbmServiceAndLbmServiceConnection {
  _id: string
  lbmServiceId: string
  lbmServiceCategoryId: string
}

interface LbmServiceAndLbmServiceConnections {
  JOIN_lbmsServices_lbmsServicesCategories: LbmServiceAndLbmServiceConnection[]
}

interface LbmServiceCategory {
  _id: string
  name: string
}

interface LbmServiceCategoryData {
  lbmServicesCategories: LbmServiceCategory[]
}

const LbmServiceCategoryWidget = ({ entity }: { _id: string, [key: string]: any }) => {
  const { data: categoriesData, loading: categoriesLoading } = useQuery<LbmServiceCategoryData>(
    GET_LBM_SERVICES_CATEGORIES
  )

  const { data: connectionsData, loading: connectionsLoading } = useQuery<LbmServiceAndLbmServiceConnections>(
    GET_JOIN_LBMS_SERVICES_AND_LBMS_SERVICES_CATEGORIES,
    {
      variables: { lbmServiceId: entity._id },
    }
  )

  const [selectedCategoryId, selectCategoryId] = useState<string | null>(null)

  const connections = Object.values(connectionsData || {})[0]

  const connectionId = connections && connections[0] && connections[0]._id

  const [save] = useMutation(CONNECT_LBM_SERVICE_AND_LBM_SERVICE_CATEGORY, {
    variables: {
      input: {
        _id: connectionId,
        lbmServiceId: entity._id,
        lbmServiceCategoryId: selectedCategoryId,
      },
    },
    refetchQueries: [
      {
        query: GET_JOIN_LBMS_SERVICES_AND_LBMS_SERVICES_CATEGORIES,
        variables: { lbmServiceId: entity._id },
      },
      {
        query: GET_VIEW_LBM_SERVICES,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!categoriesLoading && !connectionsLoading) {
      if (connections && connections[0]) {
        // ! HOTFIX: make sure there are no connections in the cache for removed categories
        const categoriesById = _.keyBy(Object.values(categoriesData!)[0], '_id')
        const validConnections = connections.filter(
          (connection: LbmServiceAndLbmServiceConnection) => categoriesById[connection.lbmServiceCategoryId]
        )

        const initialCategoryId = validConnections.length
          ? validConnections[0].lbmServiceCategoryId
          : null

        selectCategoryId(initialCategoryId)
      }
    }
  }, [categoriesLoading, connectionsLoading])

  if (categoriesLoading || connectionsLoading) return 'Loading...'

  const options = categoriesData!.lbmServicesCategories.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  return (
    <div style={{ padding: 24, width: 500, height: '100%' }}>
      <Select
        options={options}
        value={options.find(({ value }) => value === selectedCategoryId)}
        onChange={selection => selectCategoryId(selection!.value)} // can't figure out how to destructure value with TS}
      />

      <button
        style={{
          border: '1px solid black',
          cursor: 'pointer',
          padding: 4,
          marginTop: 12,
        }}
        onClick={() => save()}
      >
        Save
      </button>
    </div>
  )
}

export default LbmServiceCategoryWidget
