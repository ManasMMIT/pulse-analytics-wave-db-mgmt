import _ from 'lodash'

import entityFilter from './entityFilter'

export default (events, filters = {}) => {
  if (_.isEmpty(filters)) return events

  let filteredEvents = events
  const { entityIds } = filters

  if (entityIds) filteredEvents = entityFilter(events, entityIds)

  return filteredEvents
}
