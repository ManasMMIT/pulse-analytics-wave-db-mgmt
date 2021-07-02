import React from 'react'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'
import { transparentize, mix } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

const switchColor = Colors.GREEN

// Material UI Custom Switch Styling
const OrionSwitchStyled = withStyles({
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

const OrionSwitch = ({ key, handleToggle, value, isChecked, isDisabled }) => (
  <OrionSwitchStyled
    key={key}
    disabled={isDisabled}
    checked={isChecked}
    color="primary"
    onChange={handleToggle}
    value={value}
  />
)

export default OrionSwitch
