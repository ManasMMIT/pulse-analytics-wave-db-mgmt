import React, { useEffect, useState } from 'react'
import { transparentize } from 'polished'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { CONNECT_LBM_AND_KEY_EVENT } from 'frontend/api/mutations'
import { GET_LBM_KEY_EVENTS } from 'frontend/api/queries'

import useLbmKeyEvents from 'frontend/Orion/Organizations/Lbm/useLbmKeyEvents'

import Input from 'frontend/components/Input'
import Button from 'frontend/components/Button'
import Color from 'frontend/utils/color'

import {
  EventSection,
  LabelAndInputWrapper,
  InputLabel,
  RowInput,
  FixedControlRow,
  SaveWarningBox,
  SaveContainer,
  WidgetPanelHeader,
  WidgetPanelTitle,
  DeleteButton,
} from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal/relational-widgets/styledComponents'

interface LbmKeyEvent {
  _id: string
  lbmId: string
  date: Date | string
  title: string
  description: string
  link: string
  internalTdgNote: string
}

const LbmKeyEventsWidget = ({ entity }: { _id: string, [key: string]: any }) => {
  const { data: keyEventsData, loading: keyEventsLoading } = useLbmKeyEvents({
    lbmId: entity._id,
  })

  const [stagedEvents, stageEvents] = useState<LbmKeyEvent[]>([])

  console.log(stagedEvents)

  const [save] = useMutation(CONNECT_LBM_AND_KEY_EVENT, {
    variables: {
      input: {
        lbmId: entity._id,
        keyEvents: stagedEvents,
      },
    },
    refetchQueries: [
      {
        query: GET_LBM_KEY_EVENTS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!keyEventsLoading) {
      // strip __typename from data
      const initialKeyEvents = keyEventsData.map(
        ({ __typename, ...rest }: { __typename: string, [key: string]: any }) => rest
      )

      stageEvents(initialKeyEvents)
    }
  }, [keyEventsLoading])

  if (keyEventsLoading) return 'Loading...'

  const clonedStagedEvents: LbmKeyEvent[] = _.cloneDeep(stagedEvents)

  return (
    <div
      style={{
        width: '100%',  
        height: '100%',
        overflowY: 'auto',
        background: Color.LIGHT_BLUE_GRAY_1,
      }}
    >
      <WidgetPanelHeader>
        <WidgetPanelTitle>LBM Key Events</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedEvents.map((event, idx) => {
        const { _id, date, title, description, link, internalTdgNote } = event

        return (
          <EventSection key={_id}>
            <LabelAndInputWrapper>
              <InputLabel>Date:</InputLabel>

              <Input
                name="lbmKeyEventDate"
                type="date"
                value={date}
                onChange={({ value }) => {
                  const newDoc = _.merge(clonedStagedEvents[idx], {
                    date: value,
                  })
                  clonedStagedEvents.splice(idx, 1, newDoc)
                  stageEvents(clonedStagedEvents)
                }}
                style={{
                  width: 150,
                  borderRadius: 4,
                  border: `1px solid ${transparentize(
                    0.6,
                    Color.MEDIUM_GRAY_2
                  )}`,
                }}
              />
            </LabelAndInputWrapper>
            <LabelAndInputWrapper>
              <InputLabel>Title:</InputLabel>

              <RowInput
                value={title}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedEvents[idx], {
                    title: e.currentTarget.value,
                  })
                  clonedStagedEvents.splice(idx, 1, newDoc)
                  stageEvents(clonedStagedEvents)
                }}
              />
            </LabelAndInputWrapper>

            <LabelAndInputWrapper>
              <InputLabel>Description:</InputLabel>

              <RowInput
                value={description}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedEvents[idx], {
                    description: e.currentTarget.value,
                  })
                  clonedStagedEvents.splice(idx, 1, newDoc)
                  stageEvents(clonedStagedEvents)
                }}
              />
            </LabelAndInputWrapper>

            <LabelAndInputWrapper>
              <InputLabel>Link:</InputLabel>

              <RowInput
                value={link}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedEvents[idx], {
                    link: e.currentTarget.value,
                  })
                  clonedStagedEvents.splice(idx, 1, newDoc)
                  stageEvents(clonedStagedEvents)
                }}
              />
            </LabelAndInputWrapper>

            <LabelAndInputWrapper>
              <InputLabel>Internal TDG Note:</InputLabel>

              <RowInput
                value={internalTdgNote}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedEvents[idx], {
                    internalTdgNote: e.currentTarget.value,
                  })
                  clonedStagedEvents.splice(idx, 1, newDoc)
                  stageEvents(clonedStagedEvents)
                }}
              />
            </LabelAndInputWrapper>

            <div style={{ marginLeft: 'auto' }}>
              <DeleteButton
                onClick={() => {
                  clonedStagedEvents.splice(idx, 1)
                  stageEvents(clonedStagedEvents)
                }}
              >
                <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                <span style={{ fontWeight: 700, fontSize: 12, marginLeft: 8 }}>
                  Delete Event
                </span>
              </DeleteButton>
            </div>
          </EventSection>
        )
      })}

      <FixedControlRow>
        <div>
          <Button
            onClick={() => {
              const newKeyEvent = {
                _id: new ObjectId().toString(),
                lbmId: entity._id,
                date: '',
                title: '',
                description: '',
                link: '',
                internalTdgNote: '',
              }
              clonedStagedEvents.push(newKeyEvent)
              stageEvents(clonedStagedEvents)
            }}
          >
            + Add Key Event
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist changes.
          </SaveWarningBox>
          <Button onClick={save} color={Color.GREEN}>
            Save Key Event Changes
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default LbmKeyEventsWidget
