import React from 'react'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles';
import { transparentize, mix } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

const switchColor = Colors.PRIMARY

// Material UI Custom Switch Styling
const OrionSwitch = withStyles({
  switchBase: {
    color: mix(0.4, Colors.BLACK, Colors.WHITE),
    '&$checked': {
      color: switchColor,
    },
    '&$checked + $track': {
      backgroundColor: switchColor,
    },
  },
  checked: {},
  track: {
    backgroundColor: transparentize(0.7, Colors.BLACK),
  },
})(Switch)

export default ({
  _id,
  handleToggle,
  isChecked,
}) => (
  <OrionSwitch
    key={_id}
    checked={isChecked}
    color="primary"
    onChange={e => handleToggle(e.target.value)}
    value={_id}
  />
)
