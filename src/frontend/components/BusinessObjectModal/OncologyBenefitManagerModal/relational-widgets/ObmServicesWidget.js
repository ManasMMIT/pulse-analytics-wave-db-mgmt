import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_OBM_SERVICES,
  GET_OBM_AND_OBM_SERVICE_CONNECTIONS,
  GET_SERVICE_TEMPLATE_OBMS,
} from '../../../../api/queries'

import { CONNECT_OBM_AND_OBM_SERVICE } from '../../../../api/mutations'

import { customSelectStyles } from '../../../../components/customSelectStyles'
import Button from '../../../../components/Button'
import Color from '../../../../utils/color'

import {
  RelationalRow,
  InputContainer,
  InputLabel,
  RowInput,
  FixedControlRow,
  SaveWarningBox,
  SaveContainer,
  WidgetPanelHeader,
  WidgetPanelTitle,
  DeleteButton,
} from './styledComponents'

const ObmServicesWidget = ({ entity }) => {
  const { data: servicesData, loading: servicesLoading } = useQuery(GET_OBM_SERVICES)

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = useQuery(GET_OBM_AND_OBM_SERVICE_CONNECTIONS, { variables: { obmId: entity._id } })

  const [stagedConnections, stageConnections] = useState([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_OBM_AND_OBM_SERVICE, {
    variables: {
      input: stagedConnections,
    },
    refetchQueries: [
      {
        query: GET_OBM_AND_OBM_SERVICE_CONNECTIONS,
        variables: { obmId: entity._id },
      },
      {
        query: GET_SERVICE_TEMPLATE_OBMS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!servicesLoading && !connectionsLoading) {
      // ! HOTFIX: make sure there are no connections in the cache for removed services
      const servicesById = _.keyBy(Object.values(servicesData)[0], '_id')
      const validConnections = connectionsData.obmAndObmServiceConnections.filter(
        (connection) => servicesById[connection.obmServiceId]
      )

      // clean data of __typename and anything else
      const initialConnections = validConnections.map(({ _id, obmServiceId, obmId, rating }) => ({
        _id,
        obmServiceId,
        obmId,
        rating,
      }))

      stageConnections(initialConnections)
    }
  }, [servicesLoading, connectionsLoading])

  if (servicesLoading || connectionsLoading) return 'Loading...'

  const serviceDropdownOptions = servicesData.obmServices.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>OBM Services</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection, idx) => {
        const { _id, obmServiceId, rating } = connection

        return (
          <RelationalRow key={_id}>
            <InputContainer style={{ display: 'flex', width: 400, alignItems: 'center' }}>
              <InputLabel>OBM Service:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  styles={customSelectStyles}
                  options={serviceDropdownOptions}
                  value={serviceDropdownOptions.find(({ value }) => value === obmServiceId)}
                  onChange={({ value }) => {
                    const newDoc = _.merge(clonedStagedConnections[idx], { obmServiceId: value })
                    clonedStagedConnections.splice(idx, 1, newDoc)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>
            </InputContainer>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
              <InputLabel>Rating:</InputLabel>

              <RowInput
                type="number"
                value={String(rating)}
                style={{ width: 60 }}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedConnections[idx], {
                    rating: Number(e.currentTarget.value),
                  })
                  clonedStagedConnections.splice(idx, 1, newDoc)
                  stageConnections(clonedStagedConnections)
                }}
              />
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <DeleteButton
                onClick={() => {
                  clonedStagedConnections.splice(idx, 1)
                  stageConnections(clonedStagedConnections)
                }}
              >
                <FontAwesomeIcon size="lg" icon={faTrashAlt} />
              </DeleteButton>
            </div>
          </RelationalRow>
        )
      })}

      <FixedControlRow>
        <div>
          <Button
            onClick={() => {
              const newConnection = {
                _id: ObjectId(),
                obmServiceId: null,
                rating: 0,
                obmId: entity._id,
              }
              clonedStagedConnections.push(newConnection)
              stageConnections(clonedStagedConnections)
            }}
          >
            + Add OBM Service
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist service changes.
          </SaveWarningBox>
          <Button onClick={save} color={Color.GREEN}>
            Save Service Changes
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default ObmServicesWidget
