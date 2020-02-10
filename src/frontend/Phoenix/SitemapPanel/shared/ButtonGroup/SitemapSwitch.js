import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles';
import { transparentize, mix } from 'polished'

import { Colors } from '../../../../utils/pulseStyles'

const switchColor = Colors.PRIMARY

// Material UI Custom Switch Styling
const PhoenixSwitch = withStyles({
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

const SitemapSwitch = ({
  nodeType,
  sourceEntity,
  teamEntityNodes,
  handleToggle,
}) => (
  <PhoenixSwitch
    key={sourceEntity._id}
    checked={Boolean(teamEntityNodes[sourceEntity._id])}
    color="primary"
    onChange={e => (
      handleToggle({
        type: nodeType,
        _id: e.target.value,
        node: e.target.checked && sourceEntity,
      })
    )}
    value={sourceEntity._id}
  />
)

SitemapSwitch.defaultProps = {
  sourceEntity: {},
  teamEntityNodes: {},
  handleToggle: () => {
    console.error('No handler passed to SitemapSwitch')
  }
}

SitemapSwitch.propTypes = {
  sourceEntity: PropTypes.object,
  teamEntityNodes: PropTypes.object,
  handleToggle: PropTypes.func,
}

export default SitemapSwitch
