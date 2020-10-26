import React from 'react'
import styled from '@emotion/styled'
import { formatDateTime } from '../../utils/formatDate'
import { transparentize } from 'polished'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import useEventLog from './useEventLog'

const EventLogWrapper = styled.div(
  {
    height: '100%',
    overflowY: 'scroll',
    padding: Spacing.S4,
  },
  ({ style }) => style
)

const EventWrapper = styled.div({
  ...FontSpace.FS2,
  color: Color.BLACK,
  paddingBottom: Spacing.S3,
  paddingTop: Spacing.S3,
  margin: Spacing.S4,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

const EventHeader = styled.span({
  padding: `${Spacing.S2} 0px ${Spacing.S2} 0px`,
  fontWeight: 500,
})

const EventDiffWrapper = styled.div({
  margin: Spacing.S4,
})

const EventDiff = styled.div({
  margin: `${Spacing.S2} ${Spacing.S4}`,
})

const Field = styled.span({
  marginRight: Spacing.S3,
  color: transparentize(0.4, Color.BLACK),
  fontWeight: 400,
})

const DiffArrow = styled.span({
  padding: `0px ${Spacing.S4}`,
  color: transparentize(0.7, Color.BLACK),
})

const Timestamp = styled.div({
  color: Color.BLACK,
  fontWeight: 400,
  margin: `0 0 ${Spacing.S1} 0`,
})

const Accent = styled.span({
  fontWeight: 700,
  color: Color.BLACK,
})

const FieldChanges = ({ deltas }) => {
  return (
    <EventDiffWrapper>
      {deltas.map(({ field, before, after }) => {
        const finalBefore = before === null ? 'none' : before
        const finalAfter = after === null ? 'none' : after

        return (
          <EventDiff key={field}>
            <Field>{field}:</Field>
            <span>{finalBefore}</span>
            <DiffArrow>➔</DiffArrow>
            <span>{finalAfter}</span>
          </EventDiff>
        )
      })}
    </EventDiffWrapper>
  )
}

const BasicEvent = ({
  username,
  action,
  boName,
  deltas,
  timestamp,
  entity: { label },
}) => (
  <EventWrapper>
    <EventHeader>
      <Accent>{username}</Accent> {action} <Accent>{boName}</Accent>: {label}
    </EventHeader>
    <Timestamp>{timestamp}</Timestamp>
    <FieldChanges deltas={deltas} />
  </EventWrapper>
)

const ConnectionEvent = ({
  username,
  action,
  connectedEntities,
  deltas,
  timestamp,
}) => {
  let category = connectedEntities.map(({ boName }) => boName).join('-')

  category = `${category} Connection `

  const connectedEntityString = connectedEntities
    .map(({ entity: { label } }) => label)
    .join('-')

  return (
    <EventWrapper>
      <EventHeader>
        <Accent>{username}</Accent> {action} <Accent>{category}</Accent>(
        {connectedEntityString})
      </EventHeader>
      <Timestamp>{timestamp}</Timestamp>
      <FieldChanges deltas={deltas} />
    </EventWrapper>
  )
}

const EventLog = ({ filters, style }) => {
  const { events, loading } = useEventLog(filters)

  if (loading) return 'loading'

  return (
    <EventLogWrapper style={style}>
      {events.map((event) => {
        const timestamp = formatDateTime(event.timestamp)
        const eventProps = { ...event, timestamp }

        return event.metaType === 'basic' ? (
          <BasicEvent key={event._id} {...eventProps} />
        ) : (
          <ConnectionEvent key={event._id} {...eventProps} />
        )
      })}
    </EventLogWrapper>
  )
}

EventLog.defaultProps = {
  style: {},
}

export default EventLog
