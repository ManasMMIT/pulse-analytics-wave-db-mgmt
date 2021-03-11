import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

import { GET_EVENTS } from 'frontend/api/queries'

import filterEvents from './filterEvents'

const useEventLog = (filters) => {
  const [events, setEvents] = useState([])
  const { data, loading } = useQuery(GET_EVENTS)

  useEffect(() => {
    if (!_.isEmpty(data) && !loading) {
      const events = filterEvents(data.events, filters)
      setEvents(events)
    }
  }, [filters, loading])

  return {
    events,
    loading,
  }
}

export default useEventLog
