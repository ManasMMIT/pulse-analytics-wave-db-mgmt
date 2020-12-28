import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_OBM_TYPES,
  GET_JOIN_OBMS_AND_OBMS_TYPES,
  GET_OBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import { CONNECT_OBM_AND_OBM_TYPE } from 'frontend/api/mutations'

const ObmTypesWidget = ({ entity }) => {
  const { data: typeData, loading: typesLoading } = useQuery(GET_OBM_TYPES)

  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_JOIN_OBMS_AND_OBMS_TYPES,
    {
      variables: { obmId: entity._id },
    }
  )

  const [selectedTypeId, selectTypeId] = useState(null)

  const connections = Object.values(connectionsData || {})[0]

  const connectionId = connections && connections[0] && connections[0]._id

  const [save] = useMutation(CONNECT_OBM_AND_OBM_TYPE, {
    variables: {
      input: {
        _id: connectionId,
        obmId: entity._id,
        obmTypeId: selectedTypeId,
      },
    },
    refetchQueries: [
      {
        query: GET_JOIN_OBMS_AND_OBMS_TYPES,
        variables: { obmId: entity._id },
      },
      {
        query: GET_OBM_ORGANIZATIONS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!typesLoading && !connectionsLoading) {
      if (connections && connections[0]) {
        // ! HOTFIX: make sure there are no connections in the cache for removed types
        const typesById = _.keyBy(Object.values(typeData)[0], '_id')
        const validConnections = connections.filter(
          (connection) => typesById[connection.obmTypeId]
        )

        const initialTypeId = validConnections.length
          ? validConnections[0].obmTypeId
          : null

        selectTypeId(initialTypeId)
      }
    }
  }, [typesLoading, connectionsLoading])

  if (typesLoading || connectionsLoading) return 'Loading...'

  const options = typeData.obmTypes.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  return (
    <div style={{ padding: 24, width: 500, height: '100%' }}>
      <Select
        options={options}
        value={options.find(({ value }) => value === selectedTypeId)}
        onChange={({ value }) => selectTypeId(value)}
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

export default ObmTypesWidget
