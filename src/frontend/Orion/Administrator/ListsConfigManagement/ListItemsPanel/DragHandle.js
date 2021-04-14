import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons'
import { sortableHandle } from 'react-sortable-hoc'

import { Colors } from 'frontend/utils/pulseStyles'

const DragHandle = sortableHandle(() => (
  <span
    style={{
      opacity: 0.3,
      fontSize: 16,
    }}
  >
    <FontAwesomeIcon icon={faArrowsAltV} color={Colors.BLACK} />
  </span>
))

export default DragHandle
