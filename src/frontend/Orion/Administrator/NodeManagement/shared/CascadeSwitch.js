import React from 'react'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'

import { transparentize, mix } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

const SWITCH_COLOR = Colors.GREEN

// Material UI Custom Switch Styling
const StyledSwitch = withStyles({
  switchBase: {
    color: mix(0.4, Colors.BLACK, Colors.WHITE),
    '&$checked': {
      color: SWITCH_COLOR,
    },
    '&$checked + $track': {
      backgroundColor: SWITCH_COLOR,
    },
  },
  checked: {},
  track: {
    backgroundColor: transparentize(0.7, Colors.BLACK),
  },
})(Switch)

const CascadeSwitch = ({
  name,
  cascadeExclusions,
  handleSetCascadeExclusions,
  shouldCascadeChanges,
}) => {
  if (!shouldCascadeChanges) return null

  const isExcluded = cascadeExclusions[name]

  return (
    <>
      <StyledSwitch
        name={name}
        onChange={handleSetCascadeExclusions}
        checked={!isExcluded}
      />
      {isExcluded && (
        <div style={{ color: 'red' }}>
          Excluded from cascade to teams and users
        </div>
      )}
    </>
  )
}

export default CascadeSwitch
