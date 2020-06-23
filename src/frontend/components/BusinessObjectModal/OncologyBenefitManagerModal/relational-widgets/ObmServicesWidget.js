import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_OBM_SERVICES,
  GET_OBM_AND_OBM_SERVICE_CONNECTIONS,
  GET_SERVICE_TEMPLATE_OBMS,
} from '../../../../api/queries'

import {
  CONNECT_OBM_AND_OBM_SERVICE,
} from '../../../../api/mutations'

const ObmServicesWidget = ({ entity }) => {
  const {
    data: servicesData,
    loading: servicesLoading,
  } = useQuery(GET_OBM_SERVICES)

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = useQuery(
    GET_OBM_AND_OBM_SERVICE_CONNECTIONS,
    { variables: { obmId: entity._id } },
  )

  const [stagedConnections, stageConnections] = useState([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_OBM_AND_OBM_SERVICE, {
    variables: {
      input: stagedConnections
    },
    refetchQueries: [
      {
        query: GET_OBM_AND_OBM_SERVICE_CONNECTIONS,
        variables: { obmId: entity._id }
      },
      {
        query: GET_SERVICE_TEMPLATE_OBMS,
      }
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!servicesLoading && !connectionsLoading) {
      // clean data of __typename and anything else
      const initialConnections = connectionsData.obmAndObmServiceConnections.map(
        ({ _id, obmServiceId, obmId, rating }) => ({ _id, obmServiceId, obmId, rating })
      )

      stageConnections(initialConnections)
    }
  }, [servicesLoading, connectionsLoading])

  if (servicesLoading || connectionsLoading) return 'Loading...'

  const serviceDropdownOptions = servicesData.obmServices
    .map(({ _id, name }) => ({ value: _id, label: name }))

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ padding: 24, width: '100%', height: '100%' }}>
      {
        stagedConnections.map((connection, idx) => {
          const { _id, obmServiceId, rating } = connection

          return (
            <div key={_id} style={{ display: 'flex', border: '1px solid black', padding: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', width: 400, alignItems: 'center' }}>
                <label style={{ marginRight: 12 }}>OBM Service:</label>
                <Select
                  styles={{ container: base => ({ ...base, flex: 1 }) }}
                  options={serviceDropdownOptions}
                  value={serviceDropdownOptions.find(({ value }) => value === obmServiceId)}
                  onChange={({ value }) => {
                    const newDoc = _.merge(clonedStagedConnections[idx], { obmServiceId: value })
                    clonedStagedConnections.splice(idx, 1, newDoc)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
                <label style={{ marginRight: 12 }}>Rating:</label>

                <input
                  type="number"
                  value={String(rating)}
                  style={{ marginLeft: 12, border: '1px solid black', padding: 6, width: 50 }}
                  onChange={e => {
                    const newDoc = _.merge(clonedStagedConnections[idx], { rating: Number(e.currentTarget.value) })
                    clonedStagedConnections.splice(idx, 1, newDoc)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <button
                  style={{ marginLeft: 12, border: '1px solid black', cursor: 'pointer', padding: 4 }}
                  onClick={() => {
                    clonedStagedConnections.splice(idx, 1)
                    stageConnections(clonedStagedConnections)
                  }}
                >
                  X
              </button>
              </div>
            </div>
          )
        })
      }

      <div>
        <button
          style={{ border: '1px solid black', cursor: 'pointer', padding: 8, marginTop: 12 }}
          onClick={() => {
            const newConnection = { _id: ObjectId(), obmServiceId: null, rating: 0, obmId: entity._id }
            clonedStagedConnections.push(newConnection)
            stageConnections(clonedStagedConnections)
          }}
        >
          +
        </button>
      </div>

      <div>
        <button
          style={{ border: '1px solid black', cursor: 'pointer', padding: 4, marginTop: 12 }}
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ObmServicesWidget
