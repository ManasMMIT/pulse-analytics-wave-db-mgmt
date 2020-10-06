import _ from 'lodash'

import entityFilter from './entityFilter'

export default (events, filters = {}) => {
  if (_.isEmpty(filters)) return events

  let filteredEvents = _.cloneDeep(events)
  const { entityIds } = filters

  if (entityIds) filteredEvents = entityFilter(filteredEvents, entityIds)

  return filteredEvents
}
