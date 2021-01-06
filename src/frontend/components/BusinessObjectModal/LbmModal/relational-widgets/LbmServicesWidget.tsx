import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_LBM_SERVICES,
  GET_JOIN_LBMS_AND_LBMS_SERVICES,
  GET_VIEW_LBM_SERVICES,
} from '../../../../api/queries'

import { CONNECT_LBM_AND_LBM_SERVICE } from '../../../../api/mutations'

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
} from '../../OncologyBenefitManagerModal/relational-widgets/styledComponents'

interface LbmService {
  _id: string
  name: string
  description: string
}

interface LbmsServicesData {
  lbmServices: LbmService[]
}

interface LbmAndLbmServiceConnection {
  _id: string
  lbmId: string
  lbmServiceId: string
  rating: number
}

interface JoinLbmsAndLbmsServicesData {
  JOIN_lbms_lbmsServices: LbmAndLbmServiceConnection[]
}

const LbmServicesWidget = ({ entity }: { entity: { _id: string } }) => {
  const { data: servicesData, loading: servicesLoading } = useQuery<LbmsServicesData>(
    GET_LBM_SERVICES
  )

  const { data: connectionsData, loading: connectionsLoading } = useQuery<JoinLbmsAndLbmsServicesData>(
    GET_JOIN_LBMS_AND_LBMS_SERVICES,
    {
      variables: { lbmId: entity._id },
    }
  )

  const [stagedConnections, stageConnections] = useState<LbmAndLbmServiceConnection[]>([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_LBM_AND_LBM_SERVICE, {
    variables: {
      input: stagedConnections,
    },
    refetchQueries: [
      {
        query: GET_JOIN_LBMS_AND_LBMS_SERVICES,
        variables: { lbmId: entity._id },
      },
      {
        query: GET_VIEW_LBM_SERVICES,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!servicesLoading && !connectionsLoading) {
      // ! HOTFIX: make sure there are no connections in the cache for removed services
      const servicesById = _.keyBy(Object.values(servicesData!)[0], '_id')
      const validConnections = Object.values(connectionsData!)[0].filter(
        (connection: LbmAndLbmServiceConnection) => servicesById[connection.lbmServiceId]
      )

      // clean data of __typename and anything else
      const initialConnections = validConnections.map(
        ({ _id, lbmServiceId, lbmId, rating }: LbmAndLbmServiceConnection) => ({
          _id,
          lbmServiceId,
          lbmId,
          rating,
        })
      )

      stageConnections(initialConnections)
    }
  }, [servicesLoading, connectionsLoading])

  if (servicesLoading || connectionsLoading) return 'Loading...'

  const serviceDropdownOptions = servicesData!.lbmServices.map(
    ({ _id, name }) => ({
      value: _id,
      label: name,
    })
  )

  const clonedStagedConnections: LbmAndLbmServiceConnection[] = _.cloneDeep(stagedConnections)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>LBM Services</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection, idx) => {
        const { _id, lbmServiceId, rating } = connection

        return (
          <RelationalRow key={_id}>
            <InputContainer
              style={{ display: 'flex', width: 400, alignItems: 'center' }}
            >
              <InputLabel>LBM Service:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  styles={customSelectStyles}
                  options={serviceDropdownOptions}
                  value={serviceDropdownOptions.find(
                    ({ value }) => value === lbmServiceId
                  )}
                  onChange={(selectedItem) => {
                    const newDoc = _.merge(clonedStagedConnections[idx], {
                      lbmServiceId: selectedItem!.value,
                    })
                    clonedStagedConnections.splice(idx, 1, newDoc)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>
            </InputContainer>

            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}
            >
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
              const newConnection: LbmAndLbmServiceConnection = {
                _id: new ObjectId().toString(),
                lbmServiceId: '',
                rating: 0,
                lbmId: entity._id,
              }
              clonedStagedConnections.push(newConnection)
              stageConnections(clonedStagedConnections)
            }}
          >
            + Add LBM Service
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist service
            changes.
          </SaveWarningBox>
          <Button onClick={save} color={Color.GREEN}>
            Save Service Changes
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default LbmServicesWidget
