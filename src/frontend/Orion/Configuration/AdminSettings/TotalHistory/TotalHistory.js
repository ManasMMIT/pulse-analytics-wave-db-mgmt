import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { format } from 'date-fns'

import { GET_EVENTS } from 'frontend/api/queries'

const EventWrapper = styled.div({
  padding: 12,
  margin: 12,
  borderBottom: '1px solid black',
})

const EventHeader = styled.span({
  padding: 4,
})

const EventDiff = styled.li({
  margin: '8px 0 8px 16px',
  fontSize: 14,
})

const Timestamp = styled.span({
  fontWeight: 100,
  color: 'grey',
  fontSize: 14,
})

const FieldChanges = ({ deltas }) => {
  return (
    <ul>
      {deltas.map(({ field, before, after }) => {
        return (
          <EventDiff key={field}>
            <span style={{ marginRight: 12 }}>{field}:</span>
            <span>{`${before} -> ${after}`}</span>
          </EventDiff>
        )
      })}
    </ul>
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
      {username} {action} {boName}:{label}
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
  const connectedBoString = connectedEntities
    .map(({ boName }) => boName)
    .join('/')
  const connectedEntityString = connectedEntities
    .map(({ entity: { label } }) => label)
    .join('/')

  return (
    <EventWrapper>
      <Timestamp>{timestamp}</Timestamp>
      <EventHeader>
        {username} {action} connection {connectedBoString}{' '}
        {connectedEntityString}
      </EventHeader>
      <FieldChanges deltas={deltas} />
    </EventWrapper>
  )
}

const TotalHistory = () => {
  const { data, loading } = useQuery(GET_EVENTS)

  if (loading) return null

  return (
    <div>
      {data.events.map((event) => {
        const timestamp = format(new Date(event.timestamp), 'MMM dd yyyy')
        const eventProps = { ...event, timestamp }

        return event.metaType === 'basic' ? (
          <BasicEvent key={event._id} {...eventProps} />
        ) : (
          <ConnectionEvent key={event._id} {...eventProps} />
        )
      })}
    </div>
  )
}

export default TotalHistory
