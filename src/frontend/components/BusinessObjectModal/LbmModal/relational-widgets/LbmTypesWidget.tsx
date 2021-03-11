import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'

import {
  GET_LBM_TYPES,
  GET_JOIN_LBMS_AND_LBMS_TYPES,
  GET_LBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import { CONNECT_LBM_AND_LBM_TYPE } from 'frontend/api/mutations'

interface LbmAndLbmTypeConnection {
  _id: string
  lbmId: string
  lbmTypeId: string
}

interface JOIN_lbms_lbmsTypes_DATA {
  JOIN_lbms_lbmsTypes: LbmAndLbmTypeConnection[]
}

interface LbmType {
  _id: string
  name: string
  description: string
}

interface LbmTypesData {
  lbmTypes: LbmType[]
}

const LbmTypesWidget = ({ entity }: { entity: { _id: string } }) => {
  const { data: typeData, loading: typesLoading } = useQuery<LbmTypesData>(GET_LBM_TYPES)

  const { data: connectionsData, loading: connectionsLoading } = useQuery<JOIN_lbms_lbmsTypes_DATA>(
    GET_JOIN_LBMS_AND_LBMS_TYPES,
    {
      variables: { lbmId: entity._id },
    }
  )

  const [selectedTypeId, selectTypeId] = useState<string | null>(null)

  const connections = Object.values(connectionsData || {})[0]

  const connectionId = connections && connections[0] && connections[0]._id

  const [save] = useMutation(CONNECT_LBM_AND_LBM_TYPE, {
    variables: {
      input: {
        _id: connectionId,
        lbmId: entity._id,
        lbmTypeId: selectedTypeId,
      },
    },
    refetchQueries: [
      {
        query: GET_JOIN_LBMS_AND_LBMS_TYPES,
        variables: { lbmId: entity._id },
      },
      {
        query: GET_LBM_ORGANIZATIONS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!typesLoading && !connectionsLoading) {
      if (connections && connections[0]) {
        // ! HOTFIX: make sure there are no connections in the cache for removed types
        const typesById = _.keyBy(Object.values(typeData!)[0], '_id')
        const validConnections = connections.filter(
          (connection: LbmAndLbmTypeConnection) => typesById[connection.lbmTypeId]
        )

        const initialTypeId = validConnections.length
          ? validConnections[0].lbmTypeId
          : null

        selectTypeId(initialTypeId)
      }
    }
  }, [typesLoading, connectionsLoading])

  if (typesLoading || connectionsLoading) return 'Loading...'

  const options = typeData!.lbmTypes.map(({ _id, name }: { _id: string, name: string }) => ({
    value: _id,
    label: name,
  }))

  return (
    <div style={{ padding: 24, width: 500, height: '100%' }}>
      <Select
        options={options}
        value={options.find(({ value }) => value === selectedTypeId)}
        onChange={selection => selectTypeId(selection!.value)} // can't figure out how to destructure value with TS
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

export default LbmTypesWidget
