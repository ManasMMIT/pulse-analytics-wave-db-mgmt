import React from 'react'
import PathwaysEmailCard from './PathwaysEmailCard'
import { lighten } from 'polished'

import { Colors } from '../../utils/pulseStyles'

const SendEmailPanel = () => (
  <div
    style={{
      background: lighten(0.05, Colors.LIGHT_GRAY_1),
      flex: '1 0 auto',
      padding: 24
    }}
  >
    <PathwaysEmailCard />
  </div>
)

export default SendEmailPanel
