import React from 'react'

import EventLog from 'frontend/components/EventLog'

const style = { width: '100%' }

export default ({ entity }) => (
  <EventLog filters={{ entityIds: [entity._id] }} style={style} />
)
