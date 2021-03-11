import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_PEOPLE,
  GET_JOIN_LBMS_AND_PEOPLE,
  GET_VIEW_LBM_INFLUENCERS,
} from 'frontend/api/queries'

import { CONNECT_LBM_AND_PERSON } from 'frontend/api/mutations'

import useLbmPersonConnections from 'frontend/Orion/Organizations/Lbm/useLbmPersonConnections'

import { customSelectStyles } from 'frontend/components/customSelectStyles'
import Button from 'frontend/components/Button'
import Color from 'frontend/utils/color'

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

const MANAGEMENT_TYPES = ['Business', 'Clinical']

interface JOIN_LBM_INFLUENCER {
  _id: string
  personId: string
  lbmId: string
  position: string
  managementTypes?: string[]
}

const LbmInfluencersWidget = ({ entity }: { _id: string, [key: string]: any }) => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE)

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = useLbmPersonConnections({
    lbmId: entity._id,
  })

  const [stagedConnections, stageConnections] = useState<JOIN_LBM_INFLUENCER[]>([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_LBM_AND_PERSON, {
    variables: {
      input: stagedConnections,
    },
    refetchQueries: [
      {
        query: GET_JOIN_LBMS_AND_PEOPLE,
      },
      {
        query: GET_VIEW_LBM_INFLUENCERS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!peopleLoading && !connectionsLoading) {
      // clean data of __typename and anything else
      const initialConnections = connectionsData.map(
        ({ _id, personId, lbmId, position, managementTypes }: JOIN_LBM_INFLUENCER) => ({
          _id,
          personId,
          lbmId,
          position,
          managementTypes: managementTypes || [],
        })
      )

      stageConnections(initialConnections)
    }
  }, [peopleLoading, connectionsLoading])

  if (peopleLoading || connectionsLoading) return 'Loading...'

  const peopleDropdownOptions = peopleData.people.map(
    ({ _id, firstName, lastName }: { _id: string, firstName: string, lastName: string }) => ({
      value: _id,
      label: `${firstName} ${lastName}`,
    })
  )

  const clonedStagedConnections: JOIN_LBM_INFLUENCER[] = _.cloneDeep(stagedConnections)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>LBM Influencers</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection: JOIN_LBM_INFLUENCER, idx: number) => {
        const { _id, personId, position, managementTypes } = connection

        return (
          <RelationalRow key={_id.toString()}>
            <InputContainer>
              <InputLabel>LBM Influencer:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  styles={customSelectStyles}
                  options={peopleDropdownOptions}
                  value={peopleDropdownOptions.find(
                    ({ value }: { value: string }) => value === personId
                  )}
                  onChange={({ value }) => {
                    const newDoc = _.merge(clonedStagedConnections[idx], {
                      personId: value,
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
              <InputLabel>Position:</InputLabel>

              <RowInput
                value={position}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedConnections[idx], {
                    position: e.currentTarget.value,
                  })
                  clonedStagedConnections.splice(idx, 1, newDoc)
                  stageConnections(clonedStagedConnections)
                }}
              />
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}
            >
              <InputLabel>Management Types:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  isMulti
                  styles={customSelectStyles}
                  options={MANAGEMENT_TYPES.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  value={managementTypes?.map((type: string) => ({
                    label: type,
                    value: type,
                  }))}
                  onChange={(optionsArr) => {
                    let clonedConnection: JOIN_LBM_INFLUENCER = _.cloneDeep(
                      clonedStagedConnections[idx]
                    )

                    if (_.isEmpty(optionsArr)) {
                      clonedConnection.managementTypes = []
                    } else {
                      clonedConnection.managementTypes = optionsArr!.map(
                        ({ value }) => value
                      )
                    }

                    clonedConnection.managementTypes.sort((a, b) =>
                      a.localeCompare(b)
                    )

                    clonedStagedConnections.splice(idx, 1, clonedConnection)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>
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
              const newConnection: JOIN_LBM_INFLUENCER = {
                _id: new ObjectId().toString(),
                personId: '',
                position: '',
                lbmId: entity._id,
                managementTypes: [],
              }
              clonedStagedConnections.push(newConnection)
              stageConnections(clonedStagedConnections)
            }}
          >
            + Add Influencer
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist influencer
            changes.
          </SaveWarningBox>
          <Button onClick={save} color={Color.GREEN}>
            Save Influencer Changes
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default LbmInfluencersWidget
