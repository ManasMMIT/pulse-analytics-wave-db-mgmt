import React from 'react'
import styled from '@emotion/styled'
import { formatDateTime } from '../../utils/formatDate'

import { Spacing, AlphaColors } from 'frontend/utils/pulseStyles'

import useEventLog from './useEventLog'

const EventLogWrapper = styled.div(
  {
    height: '100%',
    overflowY: 'scroll',
  },
  ({ style }) => style
)

const EventWrapper = styled.div({
  padding: Spacing.NORMAL,
  paddingBottom: 0,
  margin: Spacing.NORMAL,
})

const EventHeader = styled.span({
  padding: `${Spacing.NORMAL} 0px ${Spacing.TINY} 0px`,
})

const EventDiffWrapper = styled.div({
  margin: Spacing.NORMAL,
})

const EventDiff = styled.div({
  margin: Spacing.NORMAL,
  marginTop: Spacing.TINY,
})

const Field = styled.span({
  margin: `0px ${Spacing.NORMAL}`,
  color: AlphaColors.Black80,
  fontWeight: 500,
})

const DiffArrow = styled.span({
  padding: `0px ${Spacing.NORMAL}`,
  color: AlphaColors.Black40,
})

const Timestamp = styled.div({
  color: AlphaColors.Black40,
  fontWeight: 500,
  margin: `${Spacing.NORMAL} 0px`,
})

const Accent = styled.span({
  fontWeight: 700,
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
    <Timestamp>{timestamp}</Timestamp>
    <EventHeader>
      <Accent>{username}</Accent> {action} <Accent>{boName}</Accent>: {label}
    </EventHeader>
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
      <Timestamp>{timestamp}</Timestamp>
      <EventHeader>
        <Accent>{username}</Accent> {action} <Accent>{category}</Accent>(
        {connectedEntityString})
      </EventHeader>
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
